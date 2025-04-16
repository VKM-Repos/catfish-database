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

    // Only run redirection if we are on the dashboard index route.
    if (location.pathname !== paths.dashboard.root) return

    if (user.defaultPassword) {
      navigate(paths.dashboard.newPassword, { replace: true })
    } else if (user.role === UserRole.FARMER) {
      navigate(paths.dashboard.home.getStarted, { replace: true })
    } else {
      navigate(paths.dashboard.home.overview, { replace: true })
    }
  }, [user, navigate, location.pathname])

  return null
}
