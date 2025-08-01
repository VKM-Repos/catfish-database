import { format, subDays, startOfDay, endOfDay, isSameDay } from 'date-fns'
import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import * as SolarIconSet from 'solar-icon-set'
import { CustomCalendar } from './custom-calendar'
import { Text } from './text'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { cn } from 'src/lib/utils'

export type DateRange = {
  from: Date
  to: Date
}

export type DateFilter = {
  id: string
  label: string
  range: DateRange
}

type MegaDatePickerProps = {
  value?: DateRange
  onChange?: (value: DateRange) => void
  className?: string
}

const PREDEFINED_FILTERS: DateFilter[] = [
  {
    id: 'all-time',
    label: 'All Time',
    range: {
      from: new Date(2000, 0, 1), // Arbitrary start date
      to: new Date(),
    },
  },
  {
    id: 'today',
    label: 'Today',
    range: {
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    },
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    range: {
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    },
  },
  {
    id: 'last-7-days',
    label: 'Last 7 Days',
    range: {
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    },
  },
  {
    id: 'last-14-days',
    label: 'Last 14 Days',
    range: {
      from: startOfDay(subDays(new Date(), 14)),
      to: endOfDay(new Date()),
    },
  },
  {
    id: 'last-30-days',
    label: 'Last 30 Days',
    range: {
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    },
  },
]

export default function MegaDatePicker({ value, onChange, className }: MegaDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null)
  const [customRange, setCustomRange] = React.useState<DateRange | null>(value || null)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date())

  // Initialize with default filter if no value provided
  React.useEffect(() => {
    if (!value) {
      const defaultFilter = PREDEFINED_FILTERS[0]
      setSelectedFilter(defaultFilter.id)
      setCalendarMonth(defaultFilter.range.from) // Set calendar to filter's start date
      onChange?.(defaultFilter.range)
    } else {
      // Check if current value matches any predefined filter
      const matchingFilter = PREDEFINED_FILTERS.find(
        (filter) => isSameDay(filter.range.from, value.from) && isSameDay(filter.range.to, value.to),
      )
      if (matchingFilter) {
        setSelectedFilter(matchingFilter.id)
        setCalendarMonth(matchingFilter.range.from) // Set calendar to filter's start date
      } else {
        setSelectedFilter(null)
        setCustomRange(value)
        setCalendarMonth(value.from) // Set calendar to custom range's start date
      }
    }
  }, [value, onChange])

  const handleFilterSelect = (filterId: string) => {
    const filter = PREDEFINED_FILTERS.find((f) => f.id === filterId)
    if (filter) {
      setSelectedFilter(filterId)
      setCustomRange(null)
      setCalendarMonth(filter.range.from) // Update calendar month to show the filter's date
      onChange?.(filter.range)
    }
  }

  const handleCustomRangeChange = (range: DateRange) => {
    setCustomRange(range)
    setSelectedFilter(null)
    setCalendarMonth(range.from) // Update calendar month to show the custom range's start date
    onChange?.(range)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (!customRange || !customRange.from || (customRange.from && customRange.to)) {
      // Start new range
      const newRange = { from: date, to: date }
      handleCustomRangeChange(newRange)
    } else if (customRange.from && !customRange.to) {
      // Complete the range
      const newRange =
        date >= customRange.from ? { from: customRange.from, to: date } : { from: date, to: customRange.from }
      handleCustomRangeChange(newRange)
    }
  }

  const getDisplayText = () => {
    if (selectedFilter) {
      const filter = PREDEFINED_FILTERS.find((f) => f.id === selectedFilter)
      return filter?.label || 'All Time'
    }
    if (customRange) {
      if (isSameDay(customRange.from, customRange.to)) {
        return format(customRange.from, 'MMM d, yyyy')
      }
      return `${format(customRange.from, 'MMM d')} - ${format(customRange.to, 'd, yyyy')}`
    }
    return 'All Time'
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i)

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month)
    const newCalendarMonth = new Date(calendarMonth.getFullYear(), monthIndex, 1)
    setCalendarMonth(newCalendarMonth)
  }

  const handleYearChange = (year: string) => {
    const newCalendarMonth = new Date(parseInt(year), calendarMonth.getMonth(), 1)
    setCalendarMonth(newCalendarMonth)
  }

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  }

  // Get the current range to display in the calendar
  const getCurrentRange = (): DateRange | undefined => {
    if (selectedFilter) {
      const filter = PREDEFINED_FILTERS.find((f) => f.id === selectedFilter)
      return filter?.range
    }
    return customRange || undefined
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn('flex w-full place-content-end items-center gap-4', className)}>
        <Text size="sm" weight="light">
          {getDisplayText()}
        </Text>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 text-neutral-500"
          >
            <Text size="sm" weight="light">
              {value ? `${format(value.from, 'MMM d')} - ${format(value.to, 'd, yyyy')}` : 'Select Date Range'}
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="max-w-[390px] overflow-hidden p-0 lg:max-w-[450px]" align="end">
        <div className="grid max-h-[450px] grid-cols-12 rounded-lg bg-white shadow-lg">
          {/* Left Panel - Predefined Filters */}
          <div className="col-span-4 min-w-[100px] border-r border-neutral-200 p-0">
            <div className="space-y-0">
              {PREDEFINED_FILTERS.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? 'neutral' : 'ghost'}
                  className={cn(
                    'h-9 w-full  justify-start rounded-none px-3 text-left transition-all duration-200',
                    selectedFilter === filter.id
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'hover:text-primary-900 text-neutral-600 hover:bg-primary-100',
                  )}
                  onClick={() => handleFilterSelect(filter.id)}
                >
                  <Text weight="normal" className="whitespace-nowrap">
                    {filter.label}
                  </Text>
                </Button>
              ))}
            </div>
          </div>

          {/* Right Panel - Calendar */}
          <div className="col-span-8 flex flex-col bg-white">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Select value={months[calendarMonth.getMonth()]} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-26 flex h-6 items-center justify-center gap-2 border-none p-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={calendarMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="h-6 w-16 border-none p-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 rounded-full border-none  p-0 shadow-none  hover:bg-neutral-100"
                  onClick={handlePrevMonth}
                >
                  <SolarIconSet.AltArrowLeft size={22} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9  rounded-full border-none p-0 shadow-none  hover:bg-neutral-100"
                  onClick={handleNextMonth}
                >
                  <SolarIconSet.AltArrowRight size={22} />
                </Button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="flex-1 px-6">
              <CustomCalendar
                mode="range"
                selected={getCurrentRange()}
                onSelect={(range) => {
                  if (range && typeof range === 'object' && 'from' in range) {
                    handleCustomRangeChange(range as DateRange)
                  }
                }}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                className="w-full"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="xs"
                  className="h-9 border-neutral-300 px-4 text-neutral-600 hover:bg-neutral-100"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  className="h-9 bg-primary-500 px-4 hover:bg-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
