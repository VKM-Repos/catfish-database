import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  language: string
  timezone: string
  dateFormat: string
  numberFormat: string
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
    analytics: boolean
    marketing: boolean
    dataCollection: boolean
  }
}

interface PreferencesState extends UserPreferences {
  setLanguage: (language: string) => void
  setTimezone: (timezone: string) => void
  setDateFormat: (format: string) => void
  setNumberFormat: (format: string) => void
  setNotificationPreference: (type: keyof UserPreferences['notifications'], enabled: boolean) => void
  setAccessibilityPreference: (type: keyof UserPreferences['accessibility'], enabled: boolean) => void
  setPrivacyPreference: (type: keyof UserPreferences['privacy'], enabled: boolean) => void
  resetPreferences: () => void
}

const initialState: Omit<
  PreferencesState,
  | 'setLanguage'
  | 'setTimezone'
  | 'setDateFormat'
  | 'setNumberFormat'
  | 'setNotificationPreference'
  | 'setAccessibilityPreference'
  | 'setPrivacyPreference'
  | 'resetPreferences'
> = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  numberFormat: 'en-US',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  },
  privacy: {
    analytics: true,
    marketing: false,
    dataCollection: true,
  },
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...initialState,
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setNumberFormat: (numberFormat) => set({ numberFormat }),
      setNotificationPreference: (type, enabled) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [type]: enabled,
          },
        })),
      setAccessibilityPreference: (type, enabled) =>
        set((state) => ({
          accessibility: {
            ...state.accessibility,
            [type]: enabled,
          },
        })),
      setPrivacyPreference: (type, enabled) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            [type]: enabled,
          },
        })),
      resetPreferences: () => set(initialState),
    }),
    {
      name: 'preferences-storage',
    },
  ),
)
