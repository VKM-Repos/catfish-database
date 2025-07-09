// src/store/date.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DateStore {
  selectedDate: string
  selectedTime?: string
  combineDateTime?: string
  setSelectedDate: (date: string) => void
  setCombineDateTime: (dateTime: string) => void
  setSelectedTime: (time: string) => void
  resetDate: () => void
}

const getDefaultDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const useDateStore = create<DateStore>()(
  persist(
    (set) => ({
      selectedDate: getDefaultDate(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setCombineDateTime: (dateTime) => set({ combineDateTime: dateTime }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      resetDate: () => set({ selectedDate: getDefaultDate() }),
    }),
    {
      name: 'date-storage',
    },
  ),
)
