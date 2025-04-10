import { useQuery, type UseQueryResult, QueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { authCache, axiosInstance } from '../config'
import { getQueryKey } from '../config/url'

type QueryKey = [string] | [string, Record<string, string | number | undefined>]

interface CreateGetQueryHookArgs<ResponseSchema extends z.ZodType> {
  /** The endpoint for the GET request */
  endpoint: string
  /** The Zod schema for the response data */
  responseSchema: ResponseSchema
  /** The query key for react-query */
  queryKey: QueryKey
  /** Property to indicate if auth is required */
  requiresAuth?: boolean
  /** Callback function called on successful request */
  onSuccess?: (data: z.infer<ResponseSchema>, queryClient: QueryClient) => void
  /** Callback function called on request error */
  onError?: (error: Error, queryClient: QueryClient) => void
  /** Callback function called when request is settled (success or error) */
  onSettled?: (data: z.infer<ResponseSchema> | undefined, error: Error | null, queryClient: QueryClient) => void
  /** Additional query options */
  options?: {
    enabled?: boolean
    staleTime?: number
    cacheTime?: number
    refetchOnWindowFocus?: boolean
  }
}

// Define the expected response structure
interface ApiResponse<T> {
  data: T
}

/**
 * Create a custom hook for performing GET requests with react-query and Zod validation
 *
 * @example
 * const useGetUser = createGetQueryHook<typeof userSchema, { id: string }>({
 *   endpoint: '/api/users/:id',
 *   responseSchema: userSchema,
 *   queryKey: ['getUser'],
 * });
 *
 * const { data, error } = useGetUser({ route: { id: 1 } });
 */
export function createGetQueryHook<
  ResponseSchema extends z.ZodType,
  RouteParams extends Record<string, string | number | undefined> = Record<string, never>,
  QueryParams extends Record<string, string | number | undefined> = Record<string, never>,
>({
  endpoint,
  responseSchema,
  queryKey,
  requiresAuth = true,
  onSuccess,
  onError,
  onSettled,
  options,
}: CreateGetQueryHookArgs<ResponseSchema>) {
  return (params?: { query?: QueryParams; route?: RouteParams }) => {
    const queryClient = new QueryClient()

    const queryFn = async () => {
      // Handle route parameters
      let url = endpoint
      if (params?.route) {
        url = Object.entries(params.route).reduce(
          (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
          endpoint,
        )
      }

      // Handle query parameters
      if (params?.query) {
        const query = new URLSearchParams()
        Object.entries(params.query).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return
          query.append(key, String(value))
        })
        if (query.toString()) {
          url += `?${query.toString()}`
        }
      }

      // Include the token in the headers if required
      const headers = requiresAuth ? { Authorization: `Bearer ${authCache.getToken()}` } : {}

      return axiosInstance
        .get<ApiResponse<unknown>>(url, { headers })
        .then((response) => {
          return responseSchema.parse(response.data)
        })
        .catch((error: unknown) => {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.format())
          }
          throw error
        })
    }

    return useQuery({
      queryKey: getQueryKey(queryKey, params?.route, params?.query),
      queryFn,
      onSuccess: (data) => onSuccess?.(data, queryClient),
      onError: (error) => onError?.(error as Error, queryClient),
      onSettled: (data, error) => onSettled?.(data, error as Error | null, queryClient),
      // enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...options,
    }) as UseQueryResult<z.infer<ResponseSchema>, Error>
  }
}
