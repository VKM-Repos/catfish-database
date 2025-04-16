import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User } from 'src/types'

export interface ExtendedAuthState extends AuthState {
  // New field for optimistic updates
  pendingUpdate: User | null

  // Optimistic update methods
  optimisticUpdateUser: (updatedData: Partial<User>) => void
  commitUpdateUser: (updatedData: Partial<User>) => void
  rollbackUpdateUser: () => void
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set, get) => ({
      // Base state and functions from AuthState
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken, expiresAt) => set({ accessToken, refreshToken, expiresAt }),
      login: (user, accessToken, refreshToken, expiresAt) => {
        set({
          user,
          accessToken,
          refreshToken,
          expiresAt,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          pendingUpdate: null,
        })
      },
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      // New properties and methods for optimistic updates
      pendingUpdate: null,

      // Immediately set a temporary updated user (optimistic)
      optimisticUpdateUser: (updatedData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ pendingUpdate: { ...currentUser, ...updatedData } })
        }
      },

      // Merge the optimistic update into the stored user and clear pendingUpdate
      commitUpdateUser: (updatedData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedData },
            pendingUpdate: null,
          })
        }
      },

      // Clear the optimistic update and revert to the stored user if the update fails
      rollbackUpdateUser: () => {
        set({ pendingUpdate: null })
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
)
