import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SplitState = {
  splitOccur: boolean
  reason: 'transfer' | 'harvest' | 'sampling' | string | null | undefined
  setSplitOccur: (value: boolean) => void
  setReason: (value: 'transfer' | 'harvest' | 'sampling' | string | null | undefined) => void
  clearSplitStore: () => void
}

export const useSplitStore = create<SplitState>()(
  persist(
    (set) => ({
      splitOccur: false,
      reason: 'sampling',
      setSplitOccur: (value) => set({ splitOccur: value }),
      setReason: (value) => set({ reason: value }),
      clearSplitStore: () => set({ splitOccur: false, reason: null }),
    }),
    {
      name: 'split-storage',
    },
  ),
)
