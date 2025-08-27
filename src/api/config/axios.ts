import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { APP_CONFIG } from 'src/assets/resources/config'
import { authCache } from './query-client'
import { useAuthStore } from 'src/store/auth.store'
import { getCurrentSubdomain } from 'src/lib/subdomain'
import { liveSubdomains, subdomainConfig } from './subdomains'

const subdomain = getCurrentSubdomain()
const config = subdomainConfig[subdomain] || subdomainConfig.default
const liveConfig = liveSubdomains[subdomain]
// Create axios instance
export const axiosInstance = axios.create({
  baseURL: APP_CONFIG.environment === 'development' ? config.apiBaseUrl : liveConfig.apiBaseUrl,
  // baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper function to check if token is expired
const isTokenExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return true
  return new Date(expiresAt).getTime() < Date.now()
}

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token check for login and refresh token requests
    if (config.url?.includes('login') || config.url?.includes('refresh-token')) {
      return config
    }

    const token = authCache.getToken()
    const expiresAt = authCache.getExpiresAt()

    // If token is expired, try to refresh it
    if (token && isTokenExpired(expiresAt)) {
      try {
        const refreshToken = authCache.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${APP_CONFIG.api.baseUrl}/auth/refresh`, { refreshToken })
        const { accessToken, newRefreshToken, expiresAt: newExpiresAt } = response.data

        // Update tokens in storage
        authCache.setToken(accessToken)
        authCache.setRefreshToken(newRefreshToken)
        authCache.setExpiresAt(newExpiresAt)

        // Update auth store
        useAuthStore.getState().setTokens(accessToken, newRefreshToken, newExpiresAt)

        // Use the new token
        config.headers.Authorization = `Bearer ${accessToken}`
      } catch (error) {
        // Clear auth state if refresh fails
        authCache.clearAuth()
        useAuthStore.getState().logout()
        throw error
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    // console.log('response: ', Response)

    // Skip refresh token logic if it's already a refresh token request
    if (originalRequest?.url?.includes('refresh')) {
      return Promise.reject(error)
    }

    // For login requests, pass through the error response as-is
    if (originalRequest?.url?.includes('login')) {
      return Promise.reject(error)
    }

    // const payload = JSON.parse(atob(token.split('.')[1]))
    // const isExpired = Date.now() >= payload.exp * 1000 // Convert to ms and compare

    // console.log('isExpired:', isExpired, 'Current token:', token)

    // For other 401 errors, try to refresh the token
    if (error.response?.status === 401) {
      console.log('401 error encountered, attempting to refresh token...')

      const { accessToken, expiresAt, refreshToken, logout, setTokens, setUser } = useAuthStore.getState()

      // ✅ Step 1 — Check if access token is expired
      const isExpired = !expiresAt || Date.now() >= new Date(expiresAt).getTime()
      // console.log('isExpired:', isExpired, 'Current token:', accessToken)

      if (!isExpired) {
        console.log('Access token not expired, skipping refresh.')
        return Promise.reject(error) // Token might be invalid for another reason
      }

      if (!refreshToken) {
        console.log('No refresh token available, logging out...')
        authCache.clearAuth()
        logout()
        return Promise.reject(error)
      }

      try {
        console.log('Attempting to get new token...')
        const response = await axios.post(`${APP_CONFIG.api.baseUrl}/auth/refresh`, {
          refreshToken,
        })

        const {
          userDto,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
        } = response.data

        setTokens(newAccessToken, newRefreshToken, newExpiresAt)
        setUser(userDto)

        // console.log('originalRequest: ', originalRequest)

        // ✅ Retry original request
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axios(originalRequest)
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        authCache.clearAuth()
        logout()
        return Promise.reject(error)
      }
    }

    // For all other errors, pass through as-is
    return Promise.reject(error)
  },
)
