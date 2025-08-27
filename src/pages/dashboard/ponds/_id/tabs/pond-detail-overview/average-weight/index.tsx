import { useState } from 'react'
import { z } from 'zod'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { formatDate } from 'src/lib/date'
import { Text } from 'src/components/ui/text'

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

const useTotalWeightOverall = createGetQueryHook({
  endpoint: '/dashboards/farmer/total-weight/overall',
  responseSchema: z.any(),
  queryKey: ['total-weight-overall'],
})

const averageWeightConfig = {
  averageWeight: {
    label: 'Weight (kg)',
    color: '#651391B2',
  },
}

interface AverageWeightProps {
  dateRange?: DateRange
}

export default function AverageWeight({ dateRange }: AverageWeightProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const { data: weightData, isLoading } = useTotalWeightOverall({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const chartData =
    weightData?.map((point: any) => ({
      month: point.interval,
      averageWeight: point.totalWeight,
    })) ?? []

  const hasNoData = chartData.length === 0

  return (
    <Card className="w-full basis-8/12 rounded-[.875rem] border border-neutral-200 p-4 lg:h-[350px] lg:w-[60%]">
      <ChartHeader
        title={'Average Weight'}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
          </div>
        }
      />
      <ChartContainer config={averageWeightConfig}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading chart...</Text>
          </div>
        ) : hasNoData ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 10,
              bottom: 200,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="10 10" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#737780', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickFormatter={(value) => formatDate(value)}
            />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={1}
              width={20}
            />
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#651391" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#651391" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white" />}
            />
            <Area dataKey="averageWeight" type="linear" stroke="#651391" fill="url(#colorWeight)" />
          </AreaChart>
        )}
      </ChartContainer>
    </Card>
  )
}
