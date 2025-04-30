import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'
import { UserRole } from 'src/types'

export default function PostLoginRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return

    // Handle password reset first
    if (user.defaultPassword) {
      navigate(paths.dashboard.newPassword, { replace: true })
      return
    }

    // Only process immediately after login
    const isInitialLogin = location.state?.from?.pathname === paths.auth.login

    if (isInitialLogin) {
      const targetPath = user.role === UserRole.FARMER ? paths.dashboard.home.getStarted : paths.dashboard.home.overview

      navigate(targetPath, { replace: true })
    }
  }, [user, navigate, location.state])

  return null
}
