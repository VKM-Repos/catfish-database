import { useState } from 'react'
import { z } from 'zod'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { AvailableFeedTypes } from 'src/lib/constants'
import { formatDate } from 'src/lib/date'
import { formatPrice } from 'src/lib/utils'
import { Text } from 'src/components/ui/text'

type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
const FEED_TYPES = Object.keys(AvailableFeedTypes) as Array<keyof typeof AvailableFeedTypes>
type FeedType = (typeof FEED_TYPES)[number]

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

const useFeedPriceTrend = createGetQueryHook({
  endpoint: '/dashboards/farmer/feed-price-trend',
  responseSchema: z.any(),
  queryKey: ['feed-price-trend'],
})

const feedPriceConfig = {
  feedPrice: { label: 'Feed Price (₦)', color: '#651391B2' },
}

export default function FeedPriceTrends() {
  const [interval, setInterval] = useState<Interval>('DAILY')
  const [feedType, setFeedType] = useState<FeedType>('PELLETS')

  const { data: trendData, isLoading } = useFeedPriceTrend({
    query: { interval, feedType },
  })

  const chartData =
    trendData?.map((d: any) => ({
      day: d.intervalLabel,
      feedPrice: d.averagePrice,
    })) ?? []

  const hasNoData = chartData.length === 0

  return (
    <Card className="h-[50rem] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader
        title="Trend of feed prices per kg"
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
            <FeedTypeFilter value={feedType} onChange={setFeedType} />
          </div>
        }
      />

      <ChartContainer config={feedPriceConfig} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading chart...</Text>
          </div>
        ) : hasNoData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <AreaChart accessibilityLayer data={chartData} margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <CartesianGrid stroke="#E5E7EB" />

            <XAxis
              dataKey="day"
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatDate(value)}
            />

            <YAxis
              domain={[0, 'auto']}
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={48}
              interval="preserveStartEnd"
              tickFormatter={(value) => formatPrice(value)}
            />

            <defs>
              <linearGradient id="colorFeedPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#651391" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#651391" stopOpacity={0} />
              </linearGradient>
            </defs>

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  hideLabel={false}
                  className="!min-w-[10rem] bg-white !p-2"
                  // formatter={(value: number, _name: string) => formatPrice(value)}
                  labelFormatter={(label) => formatDate(label)}
                />
              }
            />

            <Area type="linear" dataKey="feedPrice" stroke="#651391" fill="url(#colorFeedPrice)" />
          </AreaChart>
        )}
      </ChartContainer>
    </Card>
  )
}
