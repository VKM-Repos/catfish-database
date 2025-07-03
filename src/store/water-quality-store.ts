// src/store/water-quality.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { waterQualitySchema } from 'src/schemas'

type WaterQualityFormData = z.infer<typeof waterQualitySchema>

interface WaterQualityStore {
  formData: WaterQualityFormData
  activeInputs: Record<string, boolean>
  recordWaterQuality: boolean
  setFormData: (data: Partial<WaterQualityFormData>) => void
  setActiveInput: (fieldName: string, isActive: boolean) => void
  setRecordWaterQuality: (value: boolean) => void
  reset: () => void
}

const initialValues: WaterQualityFormData = {
  dissolvedOxygen: '',
  phLevel: '',
  temperature: '',
  ammonia: '',
  nitrite: '',
  alkalinity: '',
  hardness: '',
  observation: '',
}

export const useWaterQualityStore = create<WaterQualityStore>()(
  persist(
    (set) => ({
      formData: initialValues,
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
        }),
    }),
    {
      name: 'water-quality-storage',
      // Optional: Only persist specific fields
      // partialize: (state) => ({
      //   formData: state.formData,
      //   recordWaterQuality: state.recordWaterQuality
      // }),
    },
  ),
)
