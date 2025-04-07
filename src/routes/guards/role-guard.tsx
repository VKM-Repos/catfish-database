import { Navigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useAuthStore } from 'src/store/auth.store'
import { UserRole } from 'src/types'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to={paths.auth.login} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={paths.dashboard.root} replace />
  }

  return <>{children}</>
}
