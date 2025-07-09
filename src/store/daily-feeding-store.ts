// src/store/daily-feeding.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { dailyFeedingSchema } from 'src/schemas'

type DailyFeedingFormData = z.infer<typeof dailyFeedingSchema>

interface DailyFeedingStore {
  reportId: string | null
  setReportId: (id: string | null) => void
  formData: DailyFeedingFormData
  activeInputs: Record<string, boolean>
  setFormData: (data: Partial<DailyFeedingFormData>) => void
  setActiveInput: (fieldName: string, isActive: boolean) => void
  reset: () => void
}

const initialValues: DailyFeedingFormData = {
  feedType: '',
  pelletSize: '',
  feedQuantity: '',
  feedTime: '',
  combinedDateTime: '',
}

export const useDailyFeedingStore = create<DailyFeedingStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      reportId: null,
      setReportId: (id) => set({ reportId: id }),
      activeInputs: {},
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setActiveInput: (fieldName, isActive) =>
        set((state) => ({
          activeInputs: { ...state.activeInputs, [fieldName]: isActive },
        })),
      reset: () => set({ formData: initialValues, activeInputs: {} }),
    }),
    {
      name: 'daily-feeding-storage',
    },
  ),
)
