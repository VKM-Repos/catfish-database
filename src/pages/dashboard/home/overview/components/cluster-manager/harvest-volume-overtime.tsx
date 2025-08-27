import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Button } from 'src/components/ui/button'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import z from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'

export const description = 'A simple area chart'

const chartConfig = {
  totalQuantity: {
    label: 'Quantity',
    color: '#651391',
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
interface HarvestVolumeOvertimeProps {
  dateRange?: DateRange
}

export function HarvestVolumeOvertime({ dateRange }: HarvestVolumeOvertimeProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')
  const useGetRevenuePrice = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales',
    responseSchema: z.any(),
    queryKey: ['sales-revenue-price-trends-cluster-manager'],
  })
  const { data: harvestTrends } = useGetRevenuePrice({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  return (
    <Card className="mt-10 h-full w-full border-0">
      <CardContent className="p-0">
        <div className="flex">
          <ChartHeader
            title={`${interval.charAt(0).toUpperCase()}${interval
              .slice(1)
              .toLowerCase()} Harvest volume over time (kg)`}
            action={<IntervalFilter value={interval} onChange={setInterval} />}
          />
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={harvestTrends}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis dataKey="intervalLabel" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={90}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="totalQuantity" type="natural" fill="#B188C7" stroke="var(--color-totalQuantity)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
