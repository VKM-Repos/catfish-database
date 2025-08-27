import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FarmerReportStore = {
  farmerIdForDailyReport: string | null
  setFarmerIdForDailyReport: (farmerId: string | null) => void
  clearFarmerIdForDailyReport: () => void
}

export const useFarmerReportStore = create<FarmerReportStore>()(
  persist(
    (set) => ({
      farmerIdForDailyReport: null,
      setFarmerIdForDailyReport: (farmerId) => set({ farmerIdForDailyReport: farmerId }),
      clearFarmerIdForDailyReport: () => set({ farmerIdForDailyReport: null }),
    }),
    {
      name: 'farmer-report-storage',
    },
  ),
)
