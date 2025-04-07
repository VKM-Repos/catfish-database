import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (isAuthenticated) {
    // Redirect to dashboard if user is already logged in
    return <Navigate to={paths.dashboard.root} state={{ from: location }} replace />
  }

  return <>{children}</>
}
