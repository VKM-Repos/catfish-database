import * as React from 'react'
import { addDays, format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import * as SolarIconSet from 'solar-icon-set'
import { Calendar } from './calendar'
import { Text } from './text'
import { type DateRange } from 'react-day-picker'
import { cn } from 'src/lib/utils'

export default function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <div className="focus-within:ring-offset-background flex h-10 max-h-fit items-center overflow-hidden rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
          <div className="w-full px-3 text-sm font-light">
            <Text>
              {' '}
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Text>
          </div>
          <PopoverTrigger asChild>
            <div className="h-full cursor-pointer rounded-r-md bg-neutral-100 px-3 py-[.65rem] text-sm">
              <SolarIconSet.Calendar size={16} />
            </div>
          </PopoverTrigger>
        </div>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
