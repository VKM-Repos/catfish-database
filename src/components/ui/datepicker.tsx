import { format } from 'date-fns'
import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import * as SolarIconSet from 'solar-icon-set'
import { Calendar } from './calendar'
import { Text } from './text'

type DatePickerProps = {
  value?: string
  onChange?: (value: string) => void
} & React.HTMLAttributes<HTMLDivElement>

export default function DatePicker({ value, onChange, ...props }: DatePickerProps) {
  // Convert string value to Date
  const selectedDate = value ? new Date(value) : undefined

  const handleSelect = (date?: Date) => {
    if (onChange) {
      onChange(date ? date.toISOString() : '')
    }
  }

  return (
    <Popover>
      <div
        className="focus-within:ring-offset-background  flex h-10 max-h-fit items-center overflow-hidden rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
        {...props}
      >
        <div className="w-full px-3 text-sm font-light">
          <Text>{selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}</Text>
        </div>
        <PopoverTrigger asChild>
          <div className="h-full cursor-pointer rounded-r-md bg-neutral-100 px-3 py-[.65rem] text-sm">
            <SolarIconSet.Calendar size={16} />
          </div>
        </PopoverTrigger>
      </div>
      <PopoverContent className="z-[82] w-auto p-0" align="end">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} autoFocus />
      </PopoverContent>
    </Popover>
  )
}
