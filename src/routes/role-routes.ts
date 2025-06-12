import { APP_CONFIG } from 'src/assets/resources/config'
import { paths } from './paths'
import { UserRole } from 'src/types'

function getAllDashboardPaths(obj: any): string[] {
  return Object.values(obj).flatMap((value) => {
    if (typeof value === 'string') return value
    if (typeof value === 'function') return []
    if (typeof value === 'object') return getAllDashboardPaths(value)
    return []
  })
}

function filterOutReports(routes: string[]): string[] {
  return routes.filter((route) => !route.startsWith(paths.dashboard.reports.root))
}

const allDashboardPaths = getAllDashboardPaths(paths.dashboard)

const roleRoutes: Record<UserRole, string[]> = {
  SUPER_ADMIN: filterOutReports(allDashboardPaths),
  ADMIN: getAllDashboardPaths(paths.dashboard),
  CLUSTER_MANAGER: [
    paths.dashboard.home.root,
    paths.dashboard.newPassword,
    paths.dashboard.clusterManagers.root,
    paths.dashboard.reports.root,
    paths.dashboard.farmers.root,
    paths.dashboard.profile,
    paths.dashboard.account,
    paths.dashboard.settings,
    paths.dashboard.helpCenter,
    paths.dashboard.privacyPolicy,
    paths.dashboard.ponds.root,
    paths.dashboard.feeds.create.root,
  ],
  FARMER: [
    paths.dashboard.home.root,
    paths.dashboard.newPassword,
    paths.dashboard.home.getStarted,
    paths.dashboard.profile,
    paths.dashboard.account,
    paths.dashboard.reports.root,
    paths.dashboard.settings,
    paths.dashboard.helpCenter,
    paths.dashboard.privacyPolicy,
    paths.dashboard.ponds.root,
    paths.dashboard.feeds.create.root,
    paths.dashboard.inventory.root,
  ],
}

// Helper function to check if a user has access to a route
export function hasRouteAccess(role: UserRole, path: string): boolean {
  return roleRoutes[role]?.some((route) => path.startsWith(route)) ?? false
}

// Get routes based on user role
export const getRoutesByRole = (userRole: string) => {
  const role = APP_CONFIG.auth.roles[userRole]
  if (!role) return []

  // Super admin has access to everything except reports
  if (role.permissions.includes('*')) {
    return filterOutReports(getAllDashboardPaths(paths.dashboard))
  }

  // Return routes based on role permissions
  return roleRoutes[userRole as UserRole] || []
}
