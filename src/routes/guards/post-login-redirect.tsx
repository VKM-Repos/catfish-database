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

    // If the user qualifies for a special redirect (defaultPassword or is a farmer)
    // then redirect no matter where they currently are
    if (user.defaultPassword) {
      navigate(paths.dashboard.newPassword, { replace: true })
    } else if (user.role === UserRole.FARMER) {
      navigate(paths.dashboard.home.getStarted, { replace: true })
    } else if (location.pathname === paths.dashboard.root) {
      // For regular users: only redirect if they are on the default dashboard root.
      navigate(paths.dashboard.home.overview, { replace: true })
    }
  }, [user, navigate, location.pathname])

  return null
}
