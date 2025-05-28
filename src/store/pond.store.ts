import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PondInformation {
  name: string
  size: string
  waterSource: string
  pondType: string
  clusterId: string
  longitude: string
  latitude: string
  pondId: string
  quantity: string
  costOfSupply: string
  fishDescription: string
  fishSize: string
}

interface PondStore {
  pondData: Partial<PondInformation>
  setPondStore: (data: Partial<PondInformation>) => void
  resetPondStore: () => void
}

export const usePondStore = create<PondStore>()(
  persist(
    (set) => ({
      pondData: {},
      setPondStore: (data) =>
        set((state) => ({
          pondData: {
            ...state.pondData,
            ...data,
          },
        })),
      resetPondStore: () => set({ pondData: {} }),
    }),
    {
      name: 'pond-storage',
    },
  ),
)
