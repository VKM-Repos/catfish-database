export const paths: {
  docs: any
  auth: {
    root: string
    login: string
    register: string
    forgotPassword: string
    resetPassword: string
    otp: string
    terms: string
    privacy: string
  }
  dashboard: {
    root: string
    home: string
    management: {
      root: string
      ponds: {
        root: string
        create: {
          root: string
          addPond: string
          addFishToPond: string
        }
        view: (pondId: string) => string
        edit: (pondId: string) => string
      }
      farmers: {
        root: string
        list: string
        view: (farmerId: string) => string
        create: string
        edit: (farmerId: string) => string
      }
      clusterManagers: {
        root: string
        list: string
        view: (managerId: string) => string
        create: string
        edit: (managerId: string) => string
      }
      clusters: {
        root: string
        list: string
        view: (clusterId: string) => string
        create: string
        edit: (clusterId: string) => string
      }
    }
    reports: {
      root: string
      overview: string
      production: string
      financial: string
      analytics: string
    }
    system: {
      root: string
      auditLog: string
      permissions: string
      settings: string
      admins: {
        root: string
        list: string
        create: string
        edit: (adminId: string) => string
      }
    }
    user: {
      root: string
      profile: string
      account: string
      settings: string
      helpCenter: string
      privacyPolicy: string
    }
  }
}
