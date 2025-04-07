interface UserRole {
  id: string
  name: string
  permissions: string[]
}

interface DefaultUser {
  email: string
  password: string
  role: string
  name: string
}

interface AppConfig {
  // Application
  name: string
  version: string
  environment: string

  // API Configuration
  api: {
    baseUrl: string
    timeout: number
    useFakeBackend: boolean
  }

  // Authentication
  auth: {
    tokenKey: string
    refreshTokenKey: string
    tokenExpiry: number
    roles: Record<string, UserRole>
    defaultUsers: DefaultUser[]
  }

  // Routing
  routing: {
    redirectQueryParam: string
    defaultRoute: string
    publicRoutes: string[]
    authRoutes: string[]
  }

  // Feature Flags
  features: {
    enableAnalytics: boolean
    enableLogging: boolean
    enableErrorTracking: boolean
  }

  // UI Configuration
  ui: {
    theme: string
    enableAnimations: boolean
    dateFormat: string
    timeFormat: string
  }
}

export const APP_CONFIG: AppConfig = {
  // Application
  name: import.meta.env.VITE_APP_NAME || 'Catfish Database',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENV || 'development',

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    useFakeBackend: import.meta.env.VITE_USE_FAKE_BACKEND === 'true',
  },

  // Authentication
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'access_token',
    refreshTokenKey: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token',
    tokenExpiry: Number(import.meta.env.VITE_AUTH_TOKEN_EXPIRY) || 3600,
    roles: {
      SUPER_ADMIN: {
        id: 'super_admin',
        name: 'Super Admin',
        permissions: ['*'], // All permissions
      },
      CLUSTER_MANAGER: {
        id: 'cluster_manager',
        name: 'Cluster Manager',
        permissions: ['manage_farmers', 'view_reports', 'manage_clusters'],
      },
      FARMER: {
        id: 'farmer',
        name: 'Farmer',
        permissions: ['manage_own_farm', 'view_own_reports'],
      },
    },
    defaultUsers: [
      {
        email: 'admin@catfish.com',
        password: 'Admin@123',
        role: 'SUPER_ADMIN',
        name: 'John Admin',
      },
      {
        email: 'manager1@catfish.com',
        password: 'Manager@123',
        role: 'CLUSTER_MANAGER',
        name: 'Sarah Manager',
      },
      {
        email: 'manager2@catfish.com',
        password: 'Manager@123',
        role: 'CLUSTER_MANAGER',
        name: 'Mike Manager',
      },
      {
        email: 'farmer1@catfish.com',
        password: 'Farmer@123',
        role: 'FARMER',
        name: 'David Farmer',
      },
      {
        email: 'farmer2@catfish.com',
        password: 'Farmer@123',
        role: 'FARMER',
        name: 'Emma Farmer',
      },
      {
        email: 'farmer3@catfish.com',
        password: 'Farmer@123',
        role: 'FARMER',
        name: 'James Farmer',
      },
    ],
  },

  // Routing
  routing: {
    redirectQueryParam: import.meta.env.VITE_REDIRECT_QUERY_PARAM || 'r',
    defaultRoute: import.meta.env.VITE_DEFAULT_ROUTE || '/',
    publicRoutes: ['/login', '/register', '/forgot-password'],
    authRoutes: ['/dashboard', '/profile', '/settings'],
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    enableErrorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
  },

  // UI Configuration
  ui: {
    theme: import.meta.env.VITE_THEME || 'light',
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
    dateFormat: import.meta.env.VITE_DATE_FORMAT || 'YYYY-MM-DD',
    timeFormat: import.meta.env.VITE_TIME_FORMAT || 'HH:mm:ss',
  },
}

// Helper function to check if we're in development mode
export const isDevelopment = APP_CONFIG.environment === 'development'

// Helper function to check if we're in production mode
export const isProduction = APP_CONFIG.environment === 'production'

// Helper function to check if we're in test mode
export const isTest = APP_CONFIG.environment === 'test'

// Helper function to check if a route is public
export const isPublicRoute = (route: string) => APP_CONFIG.routing.publicRoutes.includes(route)

// Helper function to check if a user has a permission
export const hasPermission = (userRole: string, permission: string) => {
  const role = APP_CONFIG.auth.roles[userRole]
  return role?.permissions.includes('*') || role?.permissions.includes(permission)
}
