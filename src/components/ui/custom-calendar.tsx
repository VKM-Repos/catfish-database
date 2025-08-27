import * as React from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
  isBefore,
  isAfter,
} from 'date-fns'
import { cn } from 'src/lib/utils'
import { Button } from './button'
import { Text } from './text'

export type DateRange = {
  from: Date
  to: Date
}

export type CalendarMode = 'single' | 'range'

export interface CustomCalendarProps {
  mode?: CalendarMode
  selected?: Date | DateRange
  onSelect?: (date: Date | DateRange | undefined) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  disabled?: (date: Date) => boolean
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function CustomCalendar({
  mode = 'single',
  selected,
  onSelect,
  month = new Date(),
  onMonthChange,
  disabled,
  className,
  minDate,
  maxDate,
}: CustomCalendarProps) {
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

  // Generate calendar days
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = []
  let day = calendarStart

  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  // Helper functions for styling
  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false

    if (mode === 'single') {
      return isSameDay(date, selected as Date)
    } else {
      const range = selected as DateRange
      return isSameDay(date, range.from) || isSameDay(date, range.to)
    }
  }

  const isDateInRange = (date: Date): boolean => {
    if (mode !== 'range' || !selected) return false

    const range = selected as DateRange
    if (!range.from || !range.to) return false

    return isWithinInterval(date, { start: range.from, end: range.to })
  }

  const isDateRangeStart = (date: Date): boolean => {
    if (mode !== 'range' || !selected) return false
    const range = selected as DateRange
    return range.from && isSameDay(date, range.from)
  }

  const isDateRangeEnd = (date: Date): boolean => {
    if (mode !== 'range' || !selected) return false
    const range = selected as DateRange
    return range.to && isSameDay(date, range.to)
  }

  const isDateInHoverRange = (date: Date): boolean => {
    if (mode !== 'range' || !selected || !hoverDate) return false

    const range = selected as DateRange
    if (!range.from || range.to) return false

    const start = isBefore(range.from, hoverDate) ? range.from : hoverDate
    const end = isAfter(range.from, hoverDate) ? range.from : hoverDate

    return isWithinInterval(date, { start, end })
  }

  const isDateDisabled = (date: Date): boolean => {
    if (disabled && disabled(date)) return true
    if (minDate && isBefore(date, minDate)) return true
    if (maxDate && isAfter(date, maxDate)) return true
    return false
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return

    if (mode === 'single') {
      onSelect?.(date)
    } else {
      const range = selected as DateRange

      if (!range || !range.from || (range.from && range.to)) {
        // Start new range
        onSelect?.({ from: date, to: date })
      } else if (range.from && !range.to) {
        // Complete the range
        if (isSameDay(date, range.from)) {
          onSelect?.({ from: date, to: date })
        } else {
          const newRange = isBefore(date, range.from) ? { from: date, to: range.from } : { from: range.from, to: date }
          onSelect?.(newRange)
        }
      }
    }
  }

  const handleDateHover = (date: Date) => {
    if (mode === 'range') {
      setHoverDate(date)
    }
  }

  const handleDateLeave = () => {
    setHoverDate(null)
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className={cn('w-full', className)}>
      {/* Week day headers */}
      <div className="mb-2 grid grid-cols-7 gap-0 border-b border-neutral-200">
        {weekDays.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center">
            <Text size="sm" className="font-medium text-neutral-500">
              {day}
            </Text>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, month)
          const isSelected = isDateSelected(date)
          const isInRange = isDateInRange(date)
          const isRangeStart = isDateRangeStart(date)
          const isRangeEnd = isDateRangeEnd(date)
          const isInHoverRange = isDateInHoverRange(date)
          const isDisabled = isDateDisabled(date)
          const isTodayDate = isToday(date)

          return (
            <div
              key={index}
              className={cn(
                'relative flex aspect-square h-full items-center justify-center gap-0',
                // Range styling
                isInRange && !isRangeStart && !isRangeEnd && 'bg-primary-100',
                isInHoverRange && !isRangeStart && 'bg-primary-100',
                // Range edges
                isRangeStart && isRangeEnd && 'rounded-full bg-primary-500 hover:text-white',
                isRangeStart && !isRangeEnd && 'rounded-l-md bg-primary-100',
                isRangeEnd && !isRangeStart && 'rounded-r-md bg-primary-100',
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 !rounded-full p-0 text-sm font-normal transition-colors',
                  // Base styling
                  isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400',
                  // Today styling
                  isTodayDate && !isSelected && 'bg-neutral-100 font-medium',
                  // Selected styling
                  isSelected && 'bg-primary-500 text-white hover:bg-primary-600',
                  // Range start/end styling
                  isRangeStart && 'bg-primary-500 text-white hover:bg-primary-600',
                  isRangeEnd && 'bg-primary-500 text-white hover:bg-primary-600',
                  // Disabled styling
                  isDisabled && 'cursor-not-allowed opacity-50',
                  // Hover styling
                  !isDisabled && !isSelected && 'hover:bg-neutral-100',
                )}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => handleDateHover(date)}
                onMouseLeave={handleDateLeave}
                disabled={isDisabled}
              >
                {format(date, 'd')}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
