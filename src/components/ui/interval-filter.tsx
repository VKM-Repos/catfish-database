import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import * as SolarIconSet from 'solar-icon-set'

export type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'

export function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}

function SelectPopover<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (newVal: T) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="neutral" size="sm" className="flex gap-x-2 !border border-neutral-200 bg-white capitalize">
          {label} <SolarIconSet.AltArrowDown size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex max-h-64 w-40 flex-col gap-1 overflow-y-scroll p-2">
        {options.map((opt) => (
          <Button
            key={opt}
            variant={opt === value ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start capitalize"
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
          >
            {opt.replaceAll('_', ' ').toLowerCase()}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
