import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'src/components/ui/mega-datepicker'

export interface FilterState {
  // Global date range
  dateRange: DateRange

  // Page-specific filters
  pageFilters: Record<string, Record<string, any>>

  // Actions
  setDateRange: (dateRange: DateRange) => void
  setPageFilter: (pageKey: string, filterKey: string, value: any) => void
  clearPageFilters: (pageKey: string) => void
  resetDateRange: () => void
}

const getDefaultDateRange = (): DateRange => ({
  from: new Date(2020, 0, 1), // Default to "All Time"
  to: new Date(),
})

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      dateRange: getDefaultDateRange(),
      pageFilters: {},

      setDateRange: (dateRange) => set({ dateRange }),

      setPageFilter: (pageKey, filterKey, value) => {
        const currentPageFilters = get().pageFilters[pageKey] || {}
        set({
          pageFilters: {
            ...get().pageFilters,
            [pageKey]: {
              ...currentPageFilters,
              [filterKey]: value,
            },
          },
        })
      },

      clearPageFilters: (pageKey) => {
        const { [pageKey]: _, ...rest } = get().pageFilters
        set({ pageFilters: rest })
      },

      resetDateRange: () => set({ dateRange: getDefaultDateRange() }),
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        dateRange: state.dateRange,
        pageFilters: state.pageFilters,
      }),
    },
  ),
)
