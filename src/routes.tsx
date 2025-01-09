import React from 'react'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ResetPasswordPage from './pages/auth/reset-password'
import AuditLogPage from './pages/dashboard/audit-log'
import SettingsPage from './pages/dashboard/settings'
import AccountPage from './pages/dashboard/account'
import ProfilePage from './pages/dashboard/profile'
import ReportsPage from './pages/dashboard/reports'
import DashboardPage from './pages/dashboard'
import HelpCenterPage from './pages/dashboard/help-center'
import PrivacyPolicyPage from './pages/dashboard/privacy-policy'
import FarmersPage from './pages/dashboard/farmers'
import ClusterManagersPage from './pages/dashboard/cluster-managers'
import ClustersPage from './pages/dashboard/system/clusters'
import PermissionsPage from './pages/dashboard/system/permissions'

export type CustomComponent = React.ComponentType & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

export const authRoutes = [
  { path: '/login', Component: LoginPage as CustomComponent },
  { path: '/forget-password', Component: ForgotPasswordPage as CustomComponent },
  { path: '/reset-password', Component: ResetPasswordPage as CustomComponent },
]

export const dashboardRoutes = [
  { path: '/', Component: DashboardPage as CustomComponent },
  { path: '/farmers', Component: FarmersPage as CustomComponent },
  { path: '/cluster-managers', Component: ClusterManagersPage as CustomComponent },
  { path: '/reports', Component: ReportsPage as CustomComponent },
  { path: '/settings', Component: SettingsPage as CustomComponent },
  { path: '/account', Component: AccountPage as CustomComponent },
  { path: '/profile', Component: ProfilePage as CustomComponent },
  { path: '/help-center', Component: HelpCenterPage as CustomComponent },
  { path: '/privacy-policy', Component: PrivacyPolicyPage as CustomComponent },
  { path: '/system/audit-log', Component: AuditLogPage as CustomComponent },
  { path: '/system/clusters', Component: ClustersPage as CustomComponent },
  { path: '/system/permissions', Component: PermissionsPage as CustomComponent },
]

export const allRoutes = [...authRoutes, ...dashboardRoutes]
