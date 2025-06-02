export const paths = {
  auth: {
    root: '/auth',
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    terms: '/auth/terms',
    privacy: '/auth/privacy',
  },

  dashboard: {
    root: '/dashboard',
    home: {
      root: '/dashboard/home',
      overview: '/dashboard/home/overview',
      newEntry: '/dashboard/home/new-entry',
      getStarted: '/dashboard/home/get-started',
    },
    profile: '/dashboard/settings?tab=account',
    account: '/dashboard/settings?tab=account',
    settings: '/dashboard/settings',
    helpCenter: '/dashboard/help-center',
    notifications: '/dashboard/notifications',
    privacyPolicy: '/dashboard/privacy-policy',
    newPassword: '/dashboard/new-password',

    farmers: {
      root: '/dashboard/farmers',
      view: (id: string) => `/dashboard/farmers/${id}`,
      create: '/dashboard/farmers/create',
      id: (id: string) => `/dashboard/farmers/${id}/edit`,
    },
    admins: {
      root: '/dashboard/admins',
      create: '/dashboard/admins/create',
      view: (adminId: string) => `/dashboard/admins/${adminId}`,
      id: (adminId: string) => `/dashboard/admins/${adminId}/edit`,
    },
    clusterManagers: {
      root: '/dashboard/cluster-managers',
      view: (id: string) => `/dashboard/cluster-managers/${id}`,
      create: '/dashboard/cluster-managers/create',
      id: (id: string) => `/dashboard/cluster-managers/${id}/edit`,
    },
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

    // Reports Routes
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

    // System Routes
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
    },
  },
} as const
