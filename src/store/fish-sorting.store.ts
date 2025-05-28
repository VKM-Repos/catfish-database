import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { z } from 'zod'
import type { sortingSchema } from 'src/schemas'

type SortingFormValues = z.infer<typeof sortingSchema>

interface FishSortingStore {
  formData: SortingFormValues
  setFormData: (data: SortingFormValues) => void
  resetFormData: () => void
}

const initialFormData: SortingFormValues = {
  splitOccur: false,
  reason: undefined,
  batches: [],
}

export const useFishSortingStore = create<FishSortingStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      setFormData: (data) => set({ formData: data }),
      resetFormData: () => set({ formData: initialFormData }),
    }),
    {
      name: 'fish-sorting-storage', // unique name for localStorage key
      // Optional: you can add a migration function if the schema changes over time
      // migrate: (persistedState, version) => { ... }
    },
  ),
)
