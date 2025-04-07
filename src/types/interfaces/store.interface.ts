export interface CacheState {
  data: Record<string, any>
  set: (key: string, value: any) => void
  get: (key: string) => any
  remove: (key: string) => void
  clear: () => void
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  accessibility: {
    highContrast: boolean
    largeText: boolean
    reducedMotion: boolean
  }
  privacy: {
    shareData: boolean
    locationTracking: boolean
    analytics: boolean
  }
}

export interface PreferencesState extends UserPreferences {
  setNotificationPreference: (type: keyof UserPreferences['notifications'], enabled: boolean) => void
  setAccessibilityPreference: (type: keyof UserPreferences['accessibility'], enabled: boolean) => void
  setPrivacyPreference: (type: keyof UserPreferences['privacy'], enabled: boolean) => void
}
