// src/store/water-quality.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { waterQualitySchema } from 'src/schemas'

type WaterQualityFormData = z.infer<typeof waterQualitySchema>

interface WaterQualityStore {
  formData: WaterQualityFormData
  reportId: string | null
  activeInputs: Record<string, boolean>
  recordWaterQuality: boolean
  setFormData: (data: Partial<WaterQualityFormData>) => void
  setActiveInput: (fieldName: string, isActive: boolean) => void
  setReportId: (id: string | null) => void
  setRecordWaterQuality: (value: boolean) => void
  reset: () => void
}

const initialValues: WaterQualityFormData = {
  dissolvedOxygen: '',
  phLevel: '',
  temperature: '',
  ammonia: '',
  nitrate: '',
  alkalinity: '',
  hardness: '',
  observation: '',
}

export const useWaterQualityStore = create<WaterQualityStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      reportId: null,
      setReportId: (id) => set({ reportId: id }),
      activeInputs: {},
      recordWaterQuality: false,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setActiveInput: (fieldName, isActive) =>
        set((state) => ({
          activeInputs: { ...state.activeInputs, [fieldName]: isActive },
        })),
      setRecordWaterQuality: (value) => set({ recordWaterQuality: value }),
      reset: () =>
        set({
          formData: initialValues,
          activeInputs: {},
          recordWaterQuality: false,
          reportId: null,
        }),
    }),
    {
      name: 'water-quality-storage',
    },
  ),
)
