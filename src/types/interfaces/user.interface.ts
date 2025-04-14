import { UserRole } from '../enums/user.enum'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone: string
  address?: string | null
  accountNonLocked: boolean
  enabled: boolean
  banUntil?: string | null
  context?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  cluster?: any | null
  stateId?: string
}

export interface AuthData {
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null, expiresAt: string | null) => void
  login: (user: User, accessToken: string, refreshToken: string, expiresAt: string) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
}
