import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { GuestGuard } from 'src/routes/guards/guest-guard'
import { AuthLayout } from 'src/components/layouts/auth'
import { LazyPage } from './lazy-page'
import { paths } from './paths'
import { DashboardLayout } from 'src/components/layouts/dashboard'
import { DashboardNoSidebarLayout } from 'src/components/layouts/dashboard/no-sidebar'
import { ErrorBoundary } from 'src/components/global/error-boundary'
import { RoleGuard } from 'src/routes/guards/role-guard'
import { UserRole } from 'src/types'
import { AuthGuard } from './guards/auth-guard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={paths.dashboard.root} replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: paths.auth.root,
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        path: paths.auth.root,
        element: <Navigate to={paths.auth.login} replace />,
      },
      {
        path: paths.auth.login,
        element: LazyPage(() => import('src/pages/auth/login')),
      },
      {
        path: paths.auth.forgotPassword,
        element: LazyPage(() => import('src/pages/auth/forgot-password')),
      },
      {
        path: paths.auth.resetPassword,
        element: LazyPage(() => import('src/pages/auth/reset-password')),
      },
    ],
  },
  {
    path: paths.dashboard.root,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        path: paths.dashboard.root,
        element: <Navigate to={paths.dashboard.home.overview} replace />,
      },
      // Home Routes
      {
        path: paths.dashboard.home.root,
        children: [
          {
            path: paths.dashboard.home.overview,
            element: LazyPage(() => import('src/pages/dashboard/home/overview')),
          },
        ],
      },
      {
        path: paths.dashboard.notifications,
        element: LazyPage(() => import('src/pages/dashboard/notifications')),
      },
      {
        path: paths.dashboard.settings,
        element: LazyPage(() => import('src/pages/dashboard/settings')),
      },
      {
        path: paths.dashboard.helpCenter,
        element: LazyPage(() => import('src/pages/dashboard/help-center')),
      },
      {
        path: paths.dashboard.privacyPolicy,
        element: LazyPage(() => import('src/pages/dashboard/privacy-policy')),
      },
      // Farmer Routes
      {
        path: paths.dashboard.farmers.root,
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers'))}
              </RoleGuard>
            ),
          },
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers/create'))}
              </RoleGuard>
            ),
          },
          {
            path: ':farmerId',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers/_id'))}
              </RoleGuard>
            ),
          },
          {
            path: ':farmerId/edit',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers/_id/edit'))}
              </RoleGuard>
            ),
          },
        ],
      },
      // Cluster Managers Routes
      {
        path: paths.dashboard.clusterManagers.root,
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/cluster-managers'))}
              </RoleGuard>
            ),
          },
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/cluster-managers/create'))}
              </RoleGuard>
            ),
          },
          {
            path: ':managerId',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/cluster-managers/_id'))}
              </RoleGuard>
            ),
          },
          {
            path: ':managerId/edit',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/cluster-managers/_id/edit'))}
              </RoleGuard>
            ),
          },
        ],
      },
      // Reports Routes
      {
        path: paths.dashboard.reports.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/reports'))}
          </RoleGuard>
        ),
        children: [
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/reports'))}
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id'))}
                  </RoleGuard>
                ),
              },
              {
                path: 'edit',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/edit'))}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
      // Admin Routes
      {
        path: paths.dashboard.admins.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
            {LazyPage(() => import('src/pages/dashboard/admins'))}
          </RoleGuard>
        ),
        children: [
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/admins/create'))}
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/admins/_id'))}
                  </RoleGuard>
                ),
              },
              {
                path: 'edit',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/admins/_id/edit'))}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
      // System Routes
      {
        path: paths.dashboard.system.root,
        children: [
          {
            path: paths.dashboard.system.permissions.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/permissions'))}
              </RoleGuard>
            ),
            children: [
              {
                path: 'create',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/permissions/create'))}
                  </RoleGuard>
                ),
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/permissions/_id'))}
                      </RoleGuard>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/permissions/_id/edit'))}
                      </RoleGuard>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: paths.dashboard.system.auditLog.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/audit-log'))}
              </RoleGuard>
            ),
            children: [
              {
                path: 'create',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/audit-log/create'))}
                  </RoleGuard>
                ),
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/audit-log/_id'))}
                      </RoleGuard>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/audit-log/_id/edit'))}
                      </RoleGuard>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: paths.dashboard.system.clusters.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/clusters'))}
              </RoleGuard>
            ),
            children: [
              {
                path: 'create',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/clusters/create'))}
                  </RoleGuard>
                ),
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/clusters/_id'))}
                      </RoleGuard>
                    ),
                  },
                  {
                    path: 'edit',
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/clusters/_id/edit'))}
                      </RoleGuard>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // Add a new route for pages that don't need the sidebar
  {
    path: paths.dashboard.root,
    element: (
      <AuthGuard>
        <DashboardNoSidebarLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: paths.dashboard.home.getStarted,
        element: LazyPage(() => import('src/pages/dashboard/home/get-started')),
      },
      {
        path: paths.dashboard.home.newEntry,
        element: LazyPage(() => import('src/pages/dashboard/home/new-entry')),
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
