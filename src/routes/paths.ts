/**
 * ------------------------------------------------------------------------
 * Application Route Paths
 * This file contains all the route path constants and path generators
 * for the application. Use these to avoid hardcoding URLs in your codebase.
 * ------------------------------------------------------------------------
 */
export const paths = {
  // ---------------- Auth Section ----------------
  /**
   * Auth routes for login, password reset, terms, and privacy.
   */
  auth: {
    root: '/auth',
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    terms: '/auth/terms',
    privacy: '/auth/privacy',
  },

  // ---------------- Dashboard Section ----------------
  /**
   * Main dashboard routes and all nested sections.
   */
  dashboard: {
    root: '/dashboard',

    // -------- Home Section --------
    /**
     * Dashboard home, overview, new entry, and get started.
     */
    home: {
      root: '/dashboard/home',
      overview: '/dashboard/home/overview',
      newEntry: '/dashboard/home/new-entry',
      getStarted: '/dashboard/home/get-started',
    },

    // -------- Profile & Settings --------
    /**
     * User profile and settings tabs.
     */
    profile: '/dashboard/settings?tab=account',
    account: '/dashboard/settings?tab=account',
    settings: '/dashboard/settings',
    helpCenter: '/dashboard/help-center',
    notifications: '/dashboard/notifications',
    privacyPolicy: '/dashboard/privacy-policy',
    newPassword: '/dashboard/new-password',

    // -------- Farmers Section --------
    /**
     * Farmer management routes.
     */
    farmers: {
      root: '/dashboard/farmers',
      view: (id: string) => `/dashboard/farmers/${id}`,
      create: '/dashboard/farmers/create',
      id: (id: string) => `/dashboard/farmers/${id}/edit`,
    },

    // -------- Admins Section --------
    /**
     * Admin management routes.
     */
    admins: {
      root: '/dashboard/admins',
      create: '/dashboard/admins/create',
      view: (adminId: string) => `/dashboard/admins/${adminId}`,
      id: (adminId: string) => `/dashboard/admins/${adminId}/edit`,
    },

    // -------- Cluster Managers Section --------
    /**
     * Cluster manager management routes.
     */
    clusterManagers: {
      root: '/dashboard/cluster-managers',
      view: (id: string) => `/dashboard/cluster-managers/${id}`,
      create: '/dashboard/cluster-managers/create',
      id: (id: string) => `/dashboard/cluster-managers/${id}/edit`,
    },

    // -------- Ponds Section --------
    /**
     * Pond management and creation steps.
     */
    ponds: {
      root: '/dashboard/ponds',
      create: {
        root: '/dashboard/ponds/create',
        addPond: '/dashboard/ponds/create/add-pond',
        addFishToPond: '/dashboard/ponds/create/add-fish-to-pond',
      },
      view: (id: string) => `/dashboard/ponds/${id}`,
      id: (id: string) => `/dashboard/ponds/${id}/edit`,
    },
    feeds: {
      create: {
        root: '/dashboard/feeds/create',
      },
    },

    // -------- Reports Section --------
    /**
     * Farm and sampling/harvest report routes.
     */
    reports: {
      root: '/dashboard/reports',
      createDailyFarmReport: (id: string) => `/dashboard/reports/create/daily-farm-report/${id}`,
      createSamplingReport: (id: string) => `/dashboard/reports/create/daily-sampling-report/${id}`,
      createHarvestReport: (id: string) => `/dashboard/reports/create/daily-harvest-report/${id}`,
      view: (id: string) => `/dashboard/reports/${id}`,
      viewFeedingReport: (id: string) => `/dashboard/reports/${id}/feeding-report`,
      viewSamplingReport: (id: string) => `/dashboard/reports/${id}/sampling-report`,
      viewHarvestReport: (id: string) => `/dashboard/reports/${id}/harvest-report`,
      editFeedingReport: (id: string) => `/dashboard/reports/${id}/edit/feeding-report`,
      editSamplingReport: (id: string) => `/dashboard/reports/${id}/edit/sampling-report`,
      editHarvestReport: (id: string) => `/dashboard/reports/${id}/edit/harvest-report`,
    },

    // -------- Inventory Section --------
    /**
     * Inventory management and report routes.
     */
    inventory: {
      root: '/dashboard/inventory',
      createFeedStock: (from: string) => `/dashboard/inventory/create/feed-stock/${from}`,
      createMaintenanceRecord: () => `/dashboard/inventory/create/maintenance-record`,
      createSalesRecord: () => `/dashboard/inventory/create/sales-record`,

      view: (id: string) => `/dashboard/inventory/${id}`,

      viewFeedActivityLog: (id: string) => `/dashboard/inventory/${id}/feed-activity-logs`,
      viewSalesRecord: (id: string) => `/dashboard/inventory/${id}/sales-record`,

      editMaintenanceRecord: (id: string) => `/dashboard/inventory/${id}/edit/maintenance-record`,
    },

    // -------- Staff management Section --------
    /**
     * Farmer Staffs.
     */
    staff: {
      root: '/dashboard/staff',
      view: (id: string) => `/dashboard/staff/${id}`,
      create: '/dashboard/staff/create',
      // id: (id: string) => `/dashboard/cluster-managers/${id}/edit`,
    },
    // -------- System Section --------
    /**
     * System management routes: permissions, audit log, clusters.
     */
    system: {
      root: '/dashboard/system',
      permissions: {
        root: '/dashboard/system/permissions',
        create: '/dashboard/system/permissions/create',
        id: (id: string) => `/dashboard/system/permissions/${id}`,
        edit: (id: string) => `/dashboard/system/permissions/${id}/edit`,
      },
      auditLog: {
        root: '/dashboard/system/audit-log',
        // create: '/dashboard/system/audit-log/create',
        id: (id: string) => `/dashboard/system/audit-log/${id}`,
      },
      clusters: {
        root: '/dashboard/system/clusters',
        create: '/dashboard/system/clusters/create',
        id: (id: string) => `/dashboard/system/clusters/${id}`,
        edit: (id: string) => `/dashboard/system/clusters/${id}/edit`,
      },
      farmRules: {
        root: '/dashboard/system/farm-rules',
        add: '/dashboard/system/farm-rules/add',
        edit: '/dashboard/system/farm-rules/edit',
      },
    },
  },
} as const
