import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FishHarvestState = {
  quantity: string
  totalWeightHarvested: string
  totalAmountSold: string
  costPerKg: string
  setQuantity: (value: string) => void
  setTotalWeightHarvested: (value: string) => void
  setTotalAmountSold: (value: string) => void
  setCostPerKg: (value: string) => void
  incrementQuantity: () => void
  decrementQuantity: () => void
  clearStore: () => void // Optional: Add clear function
}

export const useFishHarvestStore = create<FishHarvestState>()(
  persist(
    (set) => ({
      quantity: '',
      totalWeightHarvested: '',
      totalAmountSold: '',
      costPerKg: '',
      setQuantity: (value) => set({ quantity: value }),
      setTotalWeightHarvested: (value) => set({ totalWeightHarvested: value }),
      setTotalAmountSold: (value) => set({ totalAmountSold: value }),
      setCostPerKg: (value) => set({ costPerKg: value }),
      incrementQuantity: () =>
        set((state) => {
          const numericValue = state.quantity ? Number.parseInt(state.quantity, 10) : 0
          return { quantity: (numericValue + 1).toString() }
        }),
      decrementQuantity: () =>
        set((state) => {
          const numericValue = state.quantity ? Number.parseInt(state.quantity, 10) : 0
          return { quantity: Math.max(0, numericValue - 1).toString() }
        }),
      clearStore: () =>
        set({
          quantity: '',
          totalWeightHarvested: '',
          totalAmountSold: '',
          costPerKg: '',
        }),
    }),
    {
      name: 'fish-harvest-storage',
    },
  ),
)
