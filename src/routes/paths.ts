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

    // Reports Routes
    reports: {
      root: '/dashboard/reports',
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
        create: '/dashboard/system/audit-log/create',
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
