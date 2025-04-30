import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'
import { hasRouteAccess } from 'src/routes/role-routes'
import { UserRole } from 'src/types'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />
  }

  const getFallbackPath = () => {
    if (user?.role === UserRole.FARMER) {
      return paths.dashboard.home.getStarted
    }
    return paths.dashboard.home.overview
  }

  if (!hasRouteAccess(user?.role as UserRole, location.pathname)) {
    return <Navigate to={getFallbackPath()} replace />
  }

  return <>{children}</>
}
