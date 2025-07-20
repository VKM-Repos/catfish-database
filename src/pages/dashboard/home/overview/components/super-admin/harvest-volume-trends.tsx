import React, { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Popover } from '@radix-ui/react-popover'
import { PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartHeader } from 'src/components/global/chart-header'

const chartConfig = {
  value: {
    label: 'Value',
    color: '#651391',
  },
  mobile: {
    label: 'Mobile',
    color: '#0DA500',
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
interface HarvestVolumeTrendsProps {
  dateRange?: DateRange
}

export default function HarvestVolumeTrends({ dateRange }: HarvestVolumeTrendsProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetRevenuePrice = createGetQueryHook({
    endpoint: '/dashboards/super-admin/volume-of-sales',
    responseSchema: z.any(),
    queryKey: ['sales-revenue-price-trends-super-admin'],
  })
  const { data: salesRevenue } = useGetRevenuePrice({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  return (
    <Card className="h-[450px] max-h-[450px] min-h-[450px] w-full border border-neutral-200 p-[16px] ">
      <CardContent>
        <div className="flex">
          <ChartHeader
            title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} 'Harvest Volume Trend'`}
            action={<IntervalFilter value={interval} onChange={setInterval} />}
          />
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={salesRevenue}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="intervalLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
              min={0}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="totalQuantity" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
