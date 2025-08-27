'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartHeader } from 'src/components/global/chart-header'

export const description = 'A multiple bar chart'

const chartConfig = {
  stocked: {
    label: 'Stocked',
    color: '#651391',
  },
  harvested: {
    label: 'Harvested',
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
interface StockedHarvestedByClusterProps {
  dateRange?: DateRange
}
export function StockedHarvestedByCluster({ dateRange }: StockedHarvestedByClusterProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/super-admin/group-fish-availability',
    responseSchema: z.any(),
    queryKey: ['group-fish-availability-super-admin'],
  })
  const { data: groupFishAvailable } = useGetFeedConsumed({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  return (
    <Card className="h-[450px] max-h-[450px] min-h-[450px] w-full border border-neutral-200 p-[16px]">
      <CardContent>
        <div className="flex">
          <ChartHeader
            title={`${interval.charAt(0).toUpperCase()}${interval
              .slice(1)
              .toLowerCase()} Stocked vs. Harvested by Cluster`}
            action={<IntervalFilter value={interval} onChange={setInterval} />}
          />
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={groupFishAvailable}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="groupName"
              tick={{
                fontSize: Math.max(6, 10 - groupFishAvailable?.length * 0.2), // Adjust these values as needed
              }}
              angle={groupFishAvailable?.length > 6 ? -45 : 0}
              tickLine={false}
              tickMargin={20} // Increased margin for angled text
              interval={0} // Critical - forces all labels to show
              height={60} // Give more vertical space for labels
              axisLine={false}
            />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" className="bg-white" />} />
            <Bar dataKey="availableFish" max={2000} fill="var(--color-stocked)" radius={4} />
            <Bar dataKey="soldFish" fill="var(--color-harvested)" radius={4} />
          </BarChart>
        </ChartContainer>
        <FlexBox justify="center" className="mt-[6px] font-medium">
          <div className="flex items-center gap-2">
            <div className="h-1 w-10 bg-primary-500" /> Stocked
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-10 bg-[#0DA500]" /> Harvested
          </div>
        </FlexBox>
      </CardContent>
    </Card>
  )
}
