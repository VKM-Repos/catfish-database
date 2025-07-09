import { fishBehaviorSchema } from 'src/schemas'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type FishBehaviorFormData = z.infer<typeof fishBehaviorSchema>
interface FishBehaviorStore {
  formData: FishBehaviorFormData
  activeInputs: Record<string, boolean>
  reportId: string | null
  setFormData: (data: any) => void
  setActiveInput: (field: string, isActive: boolean) => void
  setReportId: (id: string | null) => void
  reset: () => void
}

const initialValues: FishBehaviorFormData = {
  behavior: '',
  observation: '',
}
export const useFishBehaviorStore = create<FishBehaviorStore>()(
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
      name: 'fish-behavior-storage',
    },
  ),
)
