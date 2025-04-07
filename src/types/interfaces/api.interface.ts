import { User } from './user.interface'

export interface ApiClient {
  post: (url: string, data: any) => Promise<any>
  get: (url: string) => Promise<any>
  put: (url: string, data: any) => Promise<any>
  patch: (url: string, data: any) => Promise<any>
  delete: (url: string) => Promise<any>
}

export interface AuthCache {
  getToken: () => string | null
  setToken: (token: string) => void
  getRefreshToken: () => string | null
  setRefreshToken: (token: string) => void
  getExpiresAt: () => string | null
  setExpiresAt: (expiresAt: string) => void
  getUser: () => User | null
  setUser: (user: User) => void
  clearAuth: () => void
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface SortableQueryParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface QueryKey {
  [key: string]: string | number | undefined
}

export interface CreateGetQueryHookArgs<ResponseSchema> {
  endpoint: string
  schema: ResponseSchema
  queryKey: string
  params?: QueryKey
}

export interface CreatePostMutationHookArgs<RequestSchema, ResponseSchema> {
  endpoint: string
  requestSchema: RequestSchema
  responseSchema: ResponseSchema
  queryKey: string
}

export interface CreatePatchMutationHookArgs<RequestSchema, ResponseSchema> {
  endpoint: string
  requestSchema: RequestSchema
  responseSchema: ResponseSchema
  queryKey: string
}

export interface CreateDeleteMutationHookArgs<ResponseSchema> {
  endpoint: string
  responseSchema: ResponseSchema
  queryKey: string
}
