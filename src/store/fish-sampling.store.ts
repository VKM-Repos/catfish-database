import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type FishSamplingData = {
  numberOfFishSampled: string
  weightOfFishSampled: string
  avgWeightFishSampled: string
  totalWeightGain: string
  totalFeedConsumed: string
  numberOfFishMortalityRecorded: string
  disease: string
  diseaseObservation: string
  behavior: string
  observation: string
}

type FishSamplingStore = FishSamplingData & {
  updateProperty: <K extends keyof FishSamplingData>(key: K, value: FishSamplingData[K]) => void
  reset: () => void
  // Optional: Add a clearStorage function if needed
  clearStorage: () => void
}

const initialState: FishSamplingData = {
  numberOfFishSampled: '',
  weightOfFishSampled: '',
  avgWeightFishSampled: '',
  totalWeightGain: '',
  totalFeedConsumed: '',
  numberOfFishMortalityRecorded: '',
  disease: '',
  diseaseObservation: '',
  behavior: '',
  observation: '',
}

export const useFishSamplingStore = create<FishSamplingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Update a specific property
      updateProperty: (key, value) => set({ [key]: value }),

      // Reset all properties to initial state
      reset: () => set(initialState),

      // Optional: Completely clear the storage
      clearStorage: () => {
        localStorage.removeItem('fish-sampling-storage')
        set(initialState)
      },
    }),
    {
      name: 'fish-sampling-storage', // unique name for the storage key
      storage: createJSONStorage(() => localStorage), // or sessionStorage
      // Optional: You can whitelist or blacklist specific properties
      // partialize: (state) => ({ ...state, diseaseObservation: undefined }),
    },
  ),
)
