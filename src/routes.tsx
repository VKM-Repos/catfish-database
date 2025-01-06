import React from 'react'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ResetPasswordPage from './pages/auth/reset-password'
import AuditLogPage from './pages/dashboard/audit-log'
import SettingsPage from './pages/dashboard/settings'
import ReportsPage from './pages/dashboard/reports'
import DashboardPage from './pages/dashboard'
// import AnalyticsPage from './pages/dashboard/analytics'
// import UsersPage from './pages/dashboard/users'
// import SystemPage from './pages/dashboard/system'

// // Nested Dashboard Pages
// import UserProfilePage from './pages/dashboard/users/profile'
// import UserSettingsPage from './pages/dashboard/users/settings'
// import SystemLogsPage from './pages/dashboard/system/logs'
// import SystemConfigPage from './pages/dashboard/system/config'

// // Dynamic Pages
// import UserDetailPage from './pages/dashboard/users/[id]'
// import SystemDetailPage from './pages/dashboard/system/[id]'

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
  { path: '/audit-log', Component: AuditLogPage as CustomComponent },
  { path: '/reports', Component: ReportsPage as CustomComponent },
  { path: '/settings', Component: SettingsPage as CustomComponent },
  //   { path: '/analytics', Component: AnalyticsPage as CustomComponent },
  //   { path: '/users', Component: UsersPage as CustomComponent },
  //   { path: '/users/profile', Component: UserProfilePage as CustomComponent },
  //   { path: '/users/settings', Component: UserSettingsPage as CustomComponent },
  //   { path: '/users/:id', Component: UserDetailPage as CustomComponent }, // Dynamic route
  //   { path: '/system', Component: SystemPage as CustomComponent },
  //   { path: '/system/logs', Component: SystemLogsPage as CustomComponent },
  //   { path: '/system/config', Component: SystemConfigPage as CustomComponent },
  //   { path: '/system/:id', Component: SystemDetailPage as CustomComponent }, // Dynamic route
]

export const allRoutes = [...authRoutes, ...dashboardRoutes]
