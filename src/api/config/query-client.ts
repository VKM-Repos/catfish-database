import { QueryClient } from '@tanstack/react-query'
import { APP_CONFIG } from 'src/assets/resources'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Authentication cache keys
export const AUTH_CACHE_KEYS = {
  user: 'auth-user',
  accessToken: APP_CONFIG.auth.tokenKey,
  refreshToken: APP_CONFIG.auth.refreshTokenKey,
  expiresAt: 'auth-expires-at',
}

// Helper functions for managing auth state in cache
export const authCache = {
  setToken: (token: string) => {
    localStorage.setItem(AUTH_CACHE_KEYS.accessToken, token)
  },
  getToken: () => localStorage.getItem(AUTH_CACHE_KEYS.accessToken),
  setRefreshToken: (token: string) => {
    localStorage.setItem(AUTH_CACHE_KEYS.refreshToken, token)
  },
  getRefreshToken: () => localStorage.getItem(AUTH_CACHE_KEYS.refreshToken),
  setExpiresAt: (expiresAt: string) => {
    localStorage.setItem(AUTH_CACHE_KEYS.expiresAt, expiresAt)
  },
  getExpiresAt: () => localStorage.getItem(AUTH_CACHE_KEYS.expiresAt),
  setUser: (user: any) => {
    queryClient.setQueryData([AUTH_CACHE_KEYS.user], user)
    localStorage.setItem(AUTH_CACHE_KEYS.user, JSON.stringify(user))
  },
  getUser: () => {
    const cached = queryClient.getQueryData([AUTH_CACHE_KEYS.user])
    if (cached) return cached

    const stored = localStorage.getItem(AUTH_CACHE_KEYS.user)
    return stored ? JSON.parse(stored) : null
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_CACHE_KEYS.accessToken)
    localStorage.removeItem(AUTH_CACHE_KEYS.refreshToken)
    localStorage.removeItem(AUTH_CACHE_KEYS.expiresAt)
    localStorage.removeItem(AUTH_CACHE_KEYS.user)
    queryClient.removeQueries([AUTH_CACHE_KEYS.user])
  },
}
