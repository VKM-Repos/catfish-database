import { useState } from 'react'
import { z } from 'zod'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { AvailableFeedTypes } from 'src/lib/constants'
import { formatDate } from 'src/lib/date'
import { Text } from 'src/components/ui/text'

type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type FeedType = keyof typeof AvailableFeedTypes
type DateRange = { from: Date; to: Date }

const FEED_TYPES = Object.keys(AvailableFeedTypes) as Array<FeedType>

function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}

function FeedTypeFilter({ value, onChange }: { value: FeedType; onChange: (v: FeedType) => void }) {
  const options: FeedType[] = [...FEED_TYPES]
  return (
    <SelectPopover<FeedType>
      label={value.replaceAll('_', ' ').toLowerCase()}
      options={options}
      value={value}
      onChange={onChange}
    />
  )
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

const useFeedConsumptionTrend = createGetQueryHook({
  endpoint: '/dashboards/farmer/feed-consumption-trend',
  responseSchema: z.any(),
  queryKey: ['feed-consumption-trend'],
})

const monthlyFeedConfig = {
  monthlyFeed: {
    label: 'Monthly Feed (kg)',
    color: '#651391B2',
  },
}

interface MonthlyFeedConsumptionProps {
  dateRange?: DateRange
}

export default function MonthlyFeedConsumption({ dateRange }: MonthlyFeedConsumptionProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')
  const [feedType, setFeedType] = useState<FeedType>('PELLETS')

  const { data: feedData, isLoading } = useFeedConsumptionTrend({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const chartData =
    feedData
      ?.find((feed: any) => feed.feedType === feedType)
      ?.dataPoints?.map((point: any) => ({
        month: point.intervalLabel,
        monthlyFeed: point.quantityInKg,
      })) ?? []

  const hasNoData = chartData.length === 0

  return (
    <Card className="h-[400px] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader
        title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} feed consumption (kg)`}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
            <FeedTypeFilter value={feedType} onChange={setFeedType} />
          </div>
        }
      />
      <ChartContainer className="h-[25rem] w-full" config={monthlyFeedConfig}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading chart...</Text>
          </div>
        ) : hasNoData ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <BarChart
            accessibilityLayer
            data={chartData}
            height={100}
            barCategoryGap={20}
            margin={{ right: 40, bottom: 100 }}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{
                fontSize: Math.max(6, 10 - chartData?.length * 0.2), // Adjust these values as needed
              }}
              angle={chartData?.length > 6 ? -45 : 0}
              tickLine={false}
              tickMargin={20} // Increased margin for angled text
              interval={0} // Critical - forces all labels to show
              height={60} // Give more vertical space for labels
              axisLine={false}
              tickFormatter={(value) => formatDate(value)}
            />
            <YAxis tick={false} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />
              }
            />
            <Bar dataKey="monthlyFeed" fill="#651391" radius={5}>
              <LabelList
                dataKey="monthlyFeed"
                position="insideTop"
                offset={12}
                className="fill-white"
                fontSize={14}
                formatter={(value: number) => `${value}kg`}
              />
            </Bar>
          </BarChart>
        )}
      </ChartContainer>
    </Card>
  )
}
