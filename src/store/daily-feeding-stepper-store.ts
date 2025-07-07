import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StepperStore {
  step: number
  maxStep: number
  next: () => void
  previous: () => void
  reset: () => void
  setStep: (step: number) => void
}

export const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      step: 1,
      maxStep: 5,
      next: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
      previous: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      reset: () => set({ step: 1 }),
      setStep: (step) => set({ step }),
    }),
    {
      name: 'stepper-storage',
    },
  ),
)
