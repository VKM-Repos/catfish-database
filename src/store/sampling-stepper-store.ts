import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type StepperState = {
  step: number
  maxStep: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useSamplingStepperStore = create<StepperState>()(
  persist(
    (set) => ({
      step: 1,
      maxStep: 5,
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, state.maxStep) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      reset: () => set({ step: 1 }),
    }),
    {
      name: 'sampling-stepper-storage', // LocalStorage key
    },
  ),
)
