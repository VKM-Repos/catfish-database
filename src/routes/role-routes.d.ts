export const routePermissions: {
  SUPER_ADMIN: string[]
  ADMIN: string[]
  CLUSTER_MANAGER: string[]
  FARMER: string[]
}

export function hasRouteAccess(userRole: string, route: string): boolean

export function getRoutesByRole(userRole: string): string[]
