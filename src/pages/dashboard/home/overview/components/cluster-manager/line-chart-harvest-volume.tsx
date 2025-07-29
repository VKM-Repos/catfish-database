import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Button } from 'src/components/ui/button'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'

export const description = 'A multiple line chart'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#651391',
  },
  price: {
    label: 'Price',
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
interface LineChartHarvestVolumeProps {
  dateRange?: DateRange
}

export function LineChartHarvestVolume({ dateRange }: LineChartHarvestVolumeProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetRevenuePrice = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales',
    responseSchema: z.any(),
    queryKey: ['revenue-and-price-trends-cluster-manager'],
  })
  const { data: revenuePrice } = useGetRevenuePrice({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const restructuredData = revenuePrice?.map((item: any) => ({
    period: item?.intervalLabel,
    revenue: item?.totalRevenue,
    price: item?.averageSellingPrice,
  }))

  return (
    <Card className="mt-10 w-full border-0">
      <CardContent>
        <div className="flex">
          <ChartHeader
            title={`${interval.charAt(0).toUpperCase()}${interval
              .slice(1)
              .toLowerCase()} Revenue & Average Price Trends`}
            action={<IntervalFilter value={interval} onChange={setInterval} />}
          />
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={restructuredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={90}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
            <Line dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
