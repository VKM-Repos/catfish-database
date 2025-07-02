import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { SideBarLink } from 'src/types/sidebar.types'

// Common links shared by all roles
const commonLinks = {
  home: {
    label: 'Overview',
    path: paths.dashboard.home.overview,
    icon: <SolarIconSet.PieChart3 color="currentColor" size={22} iconStyle="Outline" />,
  },
  reports: {
    label: 'Reports',
    path: paths.dashboard.reports.root,
    icon: <SolarIconSet.Chart2 color="currentColor" size={22} iconStyle="Outline" />,
  },
  more: {
    label: 'More',
    icon: <SolarIconSet.Widget6 color="currentColor" size={22} iconStyle="Outline" />,
    subLinks: [
      { label: 'Help Center', path: paths.dashboard.helpCenter },
      { label: 'Privacy Policy', path: paths.dashboard.privacyPolicy },
      { label: 'Settings', path: paths.dashboard.settings },
    ],
  },
}

// Role-specific links
const roleSpecificLinks = {
  clusterManagers: {
    label: 'Cluster managers',
    path: paths.dashboard.clusterManagers.root,
    icon: <SolarIconSet.Structure color="currentColor" size={22} iconStyle="Outline" />,
  },
  admins: {
    label: 'Admins',
    path: paths.dashboard.admins.root,
    icon: <SolarIconSet.ShieldUser color="currentColor" size={22} iconStyle="Outline" />,
  },
  farmers: {
    label: 'Farmers',
    path: paths.dashboard.farmers.root,
    icon: <SolarIconSet.UserHands color="currentColor" size={22} iconStyle="Outline" />,
  },
  ponds: {
    label: 'Ponds',
    path: paths.dashboard.ponds.root,
    icon: <SolarIconSet.BoxMinimalistic color="currentColor" size={22} iconStyle="Outline" />,
  },
  inventory: {
    label: 'Inventory',
    path: paths.dashboard.inventory.root,
    icon: <SolarIconSet.FolderOpen color="currentColor" size={22} iconStyle="Outline" />,
  },
  staff: {
    label: 'Staff',
    path: paths.dashboard.staff.root,
    icon: <SolarIconSet.UsersGroupRounded color="currentColor" size={22} iconStyle="Outline" />,
  },
  system: {
    label: 'System',
    icon: <SolarIconSet.Settings color="currentColor" size={22} iconStyle="Outline" />,
    subLinks: [
      { label: 'Audit log', path: paths.dashboard.system.auditLog.root },
      { label: 'Clusters', path: paths.dashboard.system.clusters.root },
      { label: 'Roles & permissions', path: paths.dashboard.system.rolesPermission.root },
      { label: 'Configuration', path: paths.dashboard.system.configuration.root },
      // { label: 'Permissions', path: paths.dashboard.system.permissions.root },
      // { label: 'Farm rules', path: paths.dashboard.system.farmRules.root },
    ],
  },
  systemAdmin: {
    label: 'System',
    icon: <SolarIconSet.Settings color="currentColor" size={22} iconStyle="Outline" />,
    subLinks: [{ label: 'Clusters', path: paths.dashboard.system.clusters.root }],
  },
}

// Combine links for each role
export const sideBarLinks: Record<string, SideBarLink[]> = {
  SUPER_ADMIN: [
    commonLinks.home,
    roleSpecificLinks.clusterManagers,
    roleSpecificLinks.admins,
    roleSpecificLinks.farmers,
    roleSpecificLinks.system,
    commonLinks.more,
  ],
  ADMIN: [
    commonLinks.home,
    roleSpecificLinks.clusterManagers,
    roleSpecificLinks.farmers,
    commonLinks.reports,
    roleSpecificLinks.systemAdmin,
    commonLinks.more,
  ],
  CLUSTER_MANAGER: [commonLinks.home, roleSpecificLinks.farmers, commonLinks.reports, commonLinks.more],
  FARMER: [
    commonLinks.home,
    roleSpecificLinks.ponds,
    commonLinks.reports,
    roleSpecificLinks.inventory,
    roleSpecificLinks.staff,
    commonLinks.more,
  ],
}
