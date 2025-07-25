'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { ChartHeader } from 'src/components/global/chart-header'
import { Button } from 'src/components/ui/button'

import { Card } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import z from 'zod'
import * as SolarIconSet from 'solar-icon-set'

export const description = 'A linear area chart'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig
type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type DateRange = { from: Date; to: Date }

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
function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}
interface FeedsPriceTrendsProps {
  dateRange?: DateRange
}
export function FeedsPriceTrends({ dateRange }: FeedsPriceTrendsProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetFeedPriceTrends = createGetQueryHook({
    endpoint: '/dashboards/cluster/feed-price-trend',
    responseSchema: z.any(),
    queryKey: ['feed-price-trends-cluster-manager'],
  })
  const { data: feedPriceTrends } = useGetFeedPriceTrends({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  return (
    <Card className=" w-full border border-neutral-200 p-4">
      <div className="flex">
        <ChartHeader
          title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} 'Trend of feed prices per kg'`}
          action={<IntervalFilter value={interval} onChange={setInterval} />}
        />
      </div>

      <ChartContainer className="-ml-5 mt-[30px] w-full" config={chartConfig}>
        <AreaChart accessibilityLayer data={feedPriceTrends || []}>
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="intervalLabel"
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            dataKey="averagePrice"
            tick={{ fill: '#737780', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            width={90}
          />

          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
          <Area dataKey="averagePrice" type="linear" fill="#D8C4E3" fillOpacity={0.4} stroke="#651391" />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
