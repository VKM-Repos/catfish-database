import { fishDiseaseSchema } from 'src/schemas'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type FishDiseaseFormData = z.infer<typeof fishDiseaseSchema>
interface FishDiseaseStore {
  formData: FishDiseaseFormData
  activeInputs: Record<string, boolean>
  reportId: string | null
  setFormData: (data: any) => void
  setActiveInput: (field: string, isActive: boolean) => void
  setReportId: (id: string | null) => void
  reset: () => void
}

const initialValues: FishDiseaseFormData = {
  disease: '',
  observation: '',
}
export const useFishDiseaseStore = create<FishDiseaseStore>()(
  persist(
    (set) => ({
      formData: initialValues,
      activeInputs: {},
      reportId: null,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setActiveInput: (field, isActive) =>
        set((state) => ({
          activeInputs: { ...state.activeInputs, [field]: isActive },
        })),
      setReportId: (id) => set({ reportId: id }),
      reset: () =>
        set({
          formData: initialValues,
          activeInputs: {},
          reportId: null,
        }),
    }),
    {
      name: 'fish-disease-storage',
    },
  ),
)
