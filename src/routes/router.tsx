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
import PostLoginRedirect from './guards/post-login-redirect'

/**
 * ------------------------------------------------------------------------
 * Root Redirect Route
 * Redirects '/' to the main dashboard root.
 * ------------------------------------------------------------------------
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={paths.dashboard.root} replace />,
    errorElement: <ErrorBoundary />,
  },

  /**
   * ------------------------------------------------------------------------
   * Auth Routes
   * Handles authentication pages: login, forgot password, reset password.
   * Wrapped with GuestGuard and AuthLayout.
   * ------------------------------------------------------------------------
   */
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

  /**
   * ------------------------------------------------------------------------
   * Main Dashboard Routes (with Sidebar)
   * Protected by AuthGuard and uses DashboardLayout.
   * Includes home, notifications, settings, help center, privacy policy,
   * ponds, farmers, cluster managers, reports, inventory, admins, and system routes.
   * ------------------------------------------------------------------------
   */
  {
    path: paths.dashboard.root,
    element: (
      <AuthGuard>
        <DashboardLayout />
        <PostLoginRedirect />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // ---------------- Home Section ----------------
      {
        index: true,
        path: paths.dashboard.root,
        element: <Navigate to={paths.dashboard.home.overview} replace />,
      },
      // Home Overview
      {
        path: paths.dashboard.home.root,
        children: [
          {
            path: paths.dashboard.home.overview,
            element: LazyPage(() => import('src/pages/dashboard/home/overview')),
          },
        ],
      },
      // Notifications
      {
        path: paths.dashboard.notifications,
        element: LazyPage(() => import('src/pages/dashboard/notifications')),
      },
      // Settings
      {
        path: paths.dashboard.settings,
        element: LazyPage(() => import('src/pages/dashboard/settings')),
      },
      // Help Center
      {
        path: paths.dashboard.helpCenter,
        element: LazyPage(() => import('src/pages/dashboard/help-center')),
      },
      // Privacy Policy
      {
        path: paths.dashboard.privacyPolicy,
        element: LazyPage(() => import('src/pages/dashboard/privacy-policy')),
      },

      // ---------------- Ponds Section ----------------
      {
        path: paths.dashboard.ponds.root,
        element: LazyPage(() => import('src/pages/dashboard/ponds')),
      },
      {
        path: `${paths.dashboard.ponds.root}/:id`,
        element: LazyPage(() => import('src/pages/dashboard/ponds/_id')),
        children: [
          {
            path: `${paths.dashboard.ponds.root}/:id/edit`,
            element: LazyPage(() => import('src/pages/dashboard/ponds/_id/edit')),
          },
        ],
      },

      // ---------------- Farmers Section ----------------
      {
        path: paths.dashboard.farmers.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
            {LazyPage(() => import('src/pages/dashboard/farmers'))}
          </RoleGuard>
        ),
        children: [
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers/create'))}
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: `${paths.dashboard.farmers.root}/:id`,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
            {LazyPage(() => import('src/pages/dashboard/farmers/_id'))}
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            path: `${paths.dashboard.farmers.root}/:id/edit`,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER]}>
                {LazyPage(() => import('src/pages/dashboard/farmers/_id/edit'))}
              </RoleGuard>
            ),
          },
        ],
      },

      // ---------------- Cluster Managers Section ----------------
      {
        path: paths.dashboard.clusterManagers.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
            {LazyPage(() => import('src/pages/dashboard/cluster-managers'))}
          </RoleGuard>
        ),
        children: [
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/cluster-managers/create'))}
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
                    {LazyPage(() => import('src/pages/dashboard/cluster-managers/_id'))}
                  </RoleGuard>
                ),
              },
              {
                path: 'edit',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/cluster-managers/_id/edit'))}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },

      // ---------------- Reports Section ----------------
      {
        path: paths.dashboard.reports.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/reports'))}
          </RoleGuard>
        ),
        children: [
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
              // Feeding, Sampling, Harvest Reports (View & Edit)
              {
                path: paths.dashboard.reports.viewFeedingReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/feeding-reports'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.reports.viewSamplingReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/sampling-reports'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.reports.viewHarvestReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/harvest-reports'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.reports.editFeedingReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/edit/feeding-reports'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.reports.editSamplingReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/edit/sampling-reports'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.reports.editHarvestReport(':id'),
                element: (
                  <RoleGuard
                    allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}
                  >
                    {LazyPage(() => import('src/pages/dashboard/reports/_id/edit/harvest-reports'))}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },

      // ---------------- Inventory Section ----------------
      {
        path: paths.dashboard.inventory.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/inventory'))}
          </RoleGuard>
        ),
        children: [
          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <RoleGuard allowedRoles={[UserRole.FARMER]}>
                    {LazyPage(() => import('src/pages/dashboard/inventory/_id'))}
                  </RoleGuard>
                ),
              },

              // Inventory Reports (View & Edit)
              {
                path: paths.dashboard.inventory.viewFeedActivityLog(':id'),
                element: (
                  <RoleGuard allowedRoles={[UserRole.FARMER]}>
                    {LazyPage(() => import('src/pages/dashboard/inventory/_id/feed-activity-logs'))}
                  </RoleGuard>
                ),
              },
              {
                path: paths.dashboard.inventory.viewSalesRecord(':id'),
                element: (
                  <RoleGuard allowedRoles={[UserRole.FARMER]}>
                    {LazyPage(() => import('src/pages/dashboard/inventory/_id/sales-records'))}
                  </RoleGuard>
                ),
              },

              {
                path: paths.dashboard.inventory.editMaintenanceRecord(':id'),
                element: (
                  <RoleGuard allowedRoles={[UserRole.FARMER]}>
                    {LazyPage(() => import('src/pages/dashboard/inventory/_id/edit/maintenance-record'))}
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: paths.dashboard.inventory.createFeedStock(':from'),
            element: (
              <RoleGuard allowedRoles={[UserRole.FARMER]}>
                {LazyPage(() => import('src/pages/dashboard/inventory/create/feed-stock'))}
              </RoleGuard>
            ),
          },
          {
            path: 'create/maintenance-record',
            element: (
              <RoleGuard allowedRoles={[UserRole.FARMER]}>
                {LazyPage(() => import('src/pages/dashboard/inventory/create/maintenance-record'))}
              </RoleGuard>
            ),
          },
          {
            path: 'create/sales-record',
            element: (
              <RoleGuard allowedRoles={[UserRole.FARMER]}>
                {LazyPage(() => import('src/pages/dashboard/inventory/create/sales-record'))}
              </RoleGuard>
            ),
          },
        ],
      },

      // ---------------- Staff Section ----------------
      {
        path: paths.dashboard.staff.root,
        element: (
          <RoleGuard allowedRoles={[UserRole.FARMER]}>{LazyPage(() => import('src/pages/dashboard/staff'))}</RoleGuard>
        ),
        children: [
          {
            path: 'create',
            element: (
              <RoleGuard allowedRoles={[UserRole.FARMER]}>
                {LazyPage(() => import('src/pages/dashboard/staff/create'))}
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: `${paths.dashboard.staff.root}/:id`, // /dashboard/staff/:id
        element: (
          <RoleGuard allowedRoles={[UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/staff/_id'))}
          </RoleGuard>
        ),
      },

      // {
      //   path: paths.dashboard.staff.view, // This handles the view route
      //   element: (
      //     <RoleGuard allowedRoles={[UserRole.FARMER]}>
      //       {LazyPage(() => import('src/pages/dashboard/staff/_id'))}
      //     </RoleGuard>
      //   ),
      // },

      {
        path: `${paths.dashboard.staff.root}:id/edit`, // This handles the edit route
        element: (
          <RoleGuard allowedRoles={[UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/staff/_id/edit'))}
          </RoleGuard>
        ),
      },

      // ---------------- Admins Section ----------------
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

      // ---------------- System Section ----------------
      {
        path: paths.dashboard.system.root,
        children: [
          // Permissions
          {
            path: paths.dashboard.system.permissions.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/permissions'))}
              </RoleGuard>
            ),
          },
          // Audit Log
          {
            path: paths.dashboard.system.auditLog.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/audit-log'))}
              </RoleGuard>
            ),
            children: [
              // Uncomment to enable audit-log creation
              // {
              //   path: 'create',
              //   element: (
              //     <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
              //       {LazyPage(() => import('src/pages/dashboard/system/audit-log/create'))}
              //     </RoleGuard>
              //   ),
              // },
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
                  // Uncomment to enable audit-log editing
                  // {
                  //   path: 'edit',
                  //   element: (
                  //     <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  //       {LazyPage(() => import('src/pages/dashboard/system/audit-log/_id/edit'))}
                  //     </RoleGuard>
                  //   ),
                  // },
                ],
              },
            ],
          },
          // Clusters
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
          // Roles and Permissions
          {
            path: paths.dashboard.system.rolesPermission.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/roles-permissions'))}
              </RoleGuard>
            ),
            children: [
              {
                path: 'create',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/roles-permissions/create'))}
                  </RoleGuard>
                ),
              },
              {
                path: ':id',
                children: [
                  {
                    path: 'edit',
                    element: (
                      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                        {LazyPage(() => import('src/pages/dashboard/system/roles-permissions/_id'))}
                      </RoleGuard>
                    ),
                  },
                ],
              },
            ],
          },
          // Farm rules
          {
            path: paths.dashboard.system.farmRules.root,
            element: (
              <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                {LazyPage(() => import('src/pages/dashboard/system/farm-rules'))}
              </RoleGuard>
            ),
            children: [
              {
                path: 'create/:navOpt',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/farm-rules/create'))}
                  </RoleGuard>
                ),
              },
              {
                path: ':id/edit',
                element: (
                  <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    {LazyPage(() => import('src/pages/dashboard/system/farm-rules/_id'))}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  /**
   * ------------------------------------------------------------------------
   * Dashboard Routes (No Sidebar)
   * For dashboard pages that do not require the sidebar layout.
   * Uses DashboardNoSidebarLayout.
   * ------------------------------------------------------------------------
   */
  {
    path: paths.dashboard.root,
    element: (
      <AuthGuard>
        <DashboardNoSidebarLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Get Started, New Entry, New Password
      {
        path: paths.dashboard.home.getStarted,
        element: LazyPage(() => import('src/pages/dashboard/home/get-started')),
      },
      {
        path: paths.dashboard.home.newEntry,
        element: LazyPage(() => import('src/pages/dashboard/home/new-entry')),
      },
      {
        path: paths.dashboard.newPassword,
        element: LazyPage(() => import('src/pages/dashboard/new-password')),
      },
      // Feeds create Steps
      {
        path: paths.dashboard.feeds.create.root,
        element: LazyPage(() => import('src/pages/dashboard/feeds/create')),
      },

      // Ponds Creation Steps
      {
        path: paths.dashboard.ponds.create.root,
        element: LazyPage(() => import('src/pages/dashboard/ponds/create')),
        children: [
          {
            path: paths.dashboard.ponds.create.addPond,
            element: LazyPage(() => import('src/pages/dashboard/ponds/create/add-pond')),
          },
          {
            path: paths.dashboard.ponds.create.addFishToPond,
            element: LazyPage(() => import('src/pages/dashboard/ponds/create/add-fish-to-pond')),
          },
        ],
      },
      // Reports Creation Steps
      {
        path: paths.dashboard.reports.createDailyFarmReport(':id'),
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/reports/create/daily-farm-report/_id'))}
          </RoleGuard>
        ),
      },
      {
        path: paths.dashboard.reports.createSamplingReport(':id'),
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/reports/create/daily-sampling-report/_id'))}
          </RoleGuard>
        ),
      },
      {
        path: paths.dashboard.reports.createHarvestReport(':id'),
        element: (
          <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]}>
            {LazyPage(() => import('src/pages/dashboard/reports/create/daily-harvest-report/_id'))}
          </RoleGuard>
        ),
      },
    ],
  },
])

/**
 * ------------------------------------------------------------------------
 * Router Provider
 * Wraps the app with the router configuration above.
 * ------------------------------------------------------------------------
 */
export function Router() {
  return <RouterProvider router={router} />
}
