// src/store/date.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DateStore {
  selectedDate: string
  setSelectedDate: (date: string) => void
  resetDate: () => void
}

const getDefaultDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // YYYY-MM-DD format
}

export const useDateStore = create<DateStore>()(
  persist(
    (set) => ({
      selectedDate: getDefaultDate(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      resetDate: () => set({ selectedDate: getDefaultDate() }),
    }),
    {
      name: 'date-storage',
    },
  ),
)
