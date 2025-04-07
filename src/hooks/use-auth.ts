import { useQuery } from '@tanstack/react-query'
import { authCache } from 'src/api/config'

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authCache.getUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}
