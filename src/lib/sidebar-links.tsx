import { ReactNode } from 'react'
import * as SolarIconSet from 'solar-icon-set'

type SideBarLink = {
  label: string
  path?: string
  icon?: ReactNode
  subLinks?: SideBarLink[]
}

export const sideBarLinks: Record<string, SideBarLink[]> = {
  cluster_manager: [
    {
      label: 'Overview',
      path: '/',
      icon: <SolarIconSet.PieChart3 color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'Farmers',
      path: '/farmers',
      icon: <SolarIconSet.Water color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <SolarIconSet.Chart2 color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'More',
      icon: <SolarIconSet.Widget6 color="currentColor" size={22} iconStyle="Outline" />,
      subLinks: [
        { label: 'Help Center', path: '/help-center' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Settings', path: '/settings' },
      ],
    },
  ],
  super_admin: [
    {
      label: 'Overview',
      path: '/',
      icon: <SolarIconSet.PieChart3 color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'Cluster managers',
      path: '/cluster-managers',
      icon: <SolarIconSet.Structure color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'Farmers',
      path: '/farmers',
      icon: <SolarIconSet.Water color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <SolarIconSet.Chart2 color="currentColor" size={22} iconStyle="Outline" />,
    },
    {
      label: 'System',
      icon: <SolarIconSet.Settings color="currentColor" size={22} iconStyle="Outline" />,
      subLinks: [
        {
          label: 'Audit log',
          path: '/system/audit-log',
        },
        { label: 'Clusters', path: '/system/clusters' },
        { label: 'Permissions', path: '/system/permissions' },
      ],
    },
    {
      label: 'More',
      icon: <SolarIconSet.Widget6 color="currentColor" size={22} iconStyle="Outline" />,
      subLinks: [
        { label: 'Help Center', path: '/help-center' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Settings', path: '/settings' },
      ],
    },
  ],
}
