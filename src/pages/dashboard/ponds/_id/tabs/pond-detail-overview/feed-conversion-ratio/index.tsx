import { useState } from 'react'
import { z } from 'zod'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Text } from 'src/components/ui/text'
import GaugeChart from 'react-gauge-chart'

type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type DateRange = { from: Date; to: Date }

function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
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

const useFCROverall = createGetQueryHook({
  endpoint: '/dashboards/farmer/fcr/overall',
  responseSchema: z.any(),
  queryKey: ['fcr-overall'],
})

interface FeedConversionRatioProps {
  dateRange?: DateRange
}

export default function FeedConversionRatio({ dateRange }: FeedConversionRatioProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const { data: fcrData, isLoading } = useFCROverall({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  // Get the latest FCR value or average if multiple data points
  const latestFCR = fcrData?.length > 0 ? fcrData[fcrData?.length - 1]?.fcrValue || 0 : 0
  const value = Math.min(latestFCR / 3, 1) // Normalize to 0-1 range for gauge display

  function roundToHalf(num: number): number {
    return Math.round(num * 2) / 2
  }

  function calculateRange(value: number) {
    const actualValue = latestFCR
    let min, mid, max
    if (actualValue <= 1) {
      min = 0.0
      mid = 0.5
      max = 1
    } else {
      min = roundToHalf(actualValue - 0.5)
      mid = roundToHalf(actualValue)
      max = roundToHalf(mid + 0.5)
    }

    if (min === mid) {
      mid = roundToHalf(mid + 0.5)
    }

    if (mid === max) {
      max = roundToHalf(max + 0.5)
    }

    return { min, mid, max }
  }

  const range = calculateRange(value)

  return (
    <Card className="h-[350px] w-full basis-4/12 rounded-[.875rem] border border-neutral-200 p-4 md:w-[60%]">
      <ChartHeader
        title={'Feed conversion ratio'}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
          </div>
        }
      />
      <div className="mt-6 flex flex-col items-center justify-between">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading...</Text>
          </div>
        ) : (
          <>
            <GaugeChart
              className="min-h-fit"
              nrOfLevels={420}
              arcsLength={[1.5, 2.0, 1.5]}
              colors={['#FAC898', '#FF5F15', '#CC5500']}
              percent={value}
              arcPadding={0.01}
              formatTextValue={() => latestFCR.toFixed(2)}
              textColor="#000"
            />
            <p className="mx-auto flex w-full max-w-[70%] items-center justify-between">
              {Object.entries(range).map(([key, val]) => (
                <span key={key}>{val.toFixed(1)}</span>
              ))}
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
