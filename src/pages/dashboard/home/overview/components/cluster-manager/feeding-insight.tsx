import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { ChartHeader } from 'src/components/global/chart-header'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: '',
    color: '#651391B2',
  },
}
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
interface FeedingInsightProps {
  dateRange?: DateRange
}
export default function FeedingInsight({ dateRange }: FeedingInsightProps) {
  const [selectedFeedType, setSelectedFeedType] = useState<string | null>(null)
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/cluster/feed-consumption-trend',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend-cluster-manager'],
  })
  const { data: feedConsumed } = useGetFeedConsumed({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const restructuredData = feedConsumed?.map((item: any) => ({
    feedType: item.feedType,
    quantityKg: item.dataPoints[0].quantityInKg,
  }))

  return (
    <Card className="w-full rounded-[.875rem] border border-neutral-200 p-4">
      <div className="flex">
        <ChartHeader
          title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} Feed Insights`}
          action={<IntervalFilter value={interval} onChange={setInterval} />}
        />
      </div>
      <Text className="text-[14px] font-medium">Most used feed brands (kg)</Text>
      <ChartContainer className="-ml-5 mt-[10px] w-full" config={monthlyFeedConfig}>
        <BarChart accessibilityLayer data={restructuredData} height={100} barCategoryGap={20}>
          <CartesianGrid />
          <XAxis
            dataKey="feedType"
            tick={{
              fontSize: Math.max(6, 10 - restructuredData?.length * 0.2), // Adjust these values as needed
            }}
            angle={restructuredData?.length > 6 ? -45 : 0}
            tickLine={false}
            tickMargin={20} // Increased margin for angled text
            interval={0} // Critical - forces all labels to show
            height={60} // Give more vertical space for labels
            axisLine={false}
          />
          <YAxis tick={{ fill: '#737780', fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={4} width={90} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="quantityKg" fill="#651391" radius={5} />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}

const monthlyFeedData = [
  {
    feedType: 'Cppens',
    feedQuantity: '50',
  },
  {
    feedType: 'Vital',
    feedQuantity: '40',
  },
  {
    feedType: 'Topfeed',
    feedQuantity: '30',
  },
  {
    feedType: 'Blue Crown',
    feedQuantity: '20',
  },
]
