import { AreaChart, CartesianGrid, XAxis, YAxis, Area, BarChart, Bar } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Popover } from '@radix-ui/react-popover'
import { PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { AvailableFeedTypes } from 'src/lib/constants'

const averageWeightConfig = {
  averageWeight: {
    label: 'Consumed',
    color: '#651391B2',
  },
}
type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type FeedType = keyof typeof AvailableFeedTypes
type DateRange = { from: Date; to: Date }

const FEED_TYPES = Object.keys(AvailableFeedTypes) as Array<FeedType>

function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}

function FeedTypeFilter({
  feedsConsumed,
  value,
  onChange,
}: {
  feedsConsumed: any
  value: string | null | any
  onChange: (v: FeedType) => void
}) {
  const [feedTypes, setFeedTypes] = useState([])
  useEffect(() => {
    const extractedFeedTypes = feedsConsumed?.map((item: any) => item?.feedType)
    setFeedTypes(extractedFeedTypes)
  }, [feedsConsumed])
  return (
    <SelectPopover<FeedType>
      label={value?.replaceAll('_', ' ').toLowerCase()}
      options={feedTypes || []}
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

interface GrowthFeedingProps {
  dateRange?: DateRange
}
export default function GrowthFeedingPerformance({ dateRange }: GrowthFeedingProps) {
  const [perPondInterval, setPerPondInterval] = useState<Interval>('MONTHLY')
  const [interval, setInterval] = useState<Interval>('MONTHLY')
  const [feedType, setFeedType] = useState<string | null>(null)

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed-consumption-trend',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend'],
  })
  const { data: feedConsumed } = useGetFeedConsumed({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetFeedConsumedByPond = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed-consumption/per-pond',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend-per-pond'],
  })
  const { data: feedConsumedByPond } = useGetFeedConsumedByPond({
    query: {
      interval: perPondInterval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const restructuredData = feedConsumedByPond?.map((pond: any) => {
    const latestConsumption = pond.consumptionByInterval[pond.consumptionByInterval.length - 1]

    return {
      pondName: pond.pondName,
      totalQuantity: latestConsumption.totalQuantity,
    }
  })

  useEffect(() => {
    if (feedConsumed && feedConsumed.length > 0 && !feedType) {
      const feedWithMostData = feedConsumed.reduce((prev: any, current: any) =>
        prev.dataPoints.length > current.dataPoints.length ? prev : current,
      )
      setFeedType(feedWithMostData.feedType)
    }
  }, [feedConsumed, feedType])

  const getChartData = () => {
    if (!feedType || !feedConsumed) return []

    const selectedFeedData = feedConsumed.find((feed: any) => feed.feedType === feedType)

    if (!selectedFeedData) return []

    return selectedFeedData.dataPoints.map((point: any) => ({
      period: point.intervalLabel,
      averageWeight: point.quantityInKg,
    }))
  }

  const chartData = getChartData()
  const feedConsumedByPondConfig = {
    monthlyFeed: {
      label: '',
      color: '#651391B2',
    },
  }
  return (
    <div className="flex w-full flex-col gap-[20px] lg:flex-row">
      <Card className="w-full rounded-[.875rem] border border-neutral-200 p-4">
        <div className="w-full gap-5">
          <div className="flex ">
            <ChartHeader
              title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} Feed Consumed`}
              action={
                <div className="flex gap-2">
                  <IntervalFilter value={interval} onChange={setInterval} />
                  <FeedTypeFilter feedsConsumed={feedConsumed} value={feedType} onChange={setFeedType} />
                </div>
              }
            />
          </div>
          <ChartContainer config={averageWeightConfig}>
            {chartData.length > 0 ? (
              <AreaChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={true} />
                <XAxis dataKey="period" tick={{ fill: '#737780', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: '#737780', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={4}
                  width={90}
                />
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#651391" stopOpacity={0.7} />
                    {/* <stop offset="100%" stopColor="#651391" stopOpacity={0} /> */}
                  </linearGradient>
                </defs>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel={false} className=" bg-white" />}
                />
                <Area dataKey="averageWeight" type="linear" dot={true} stroke="#651391" fill="url(#colorWeight)" />
              </AreaChart>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <Text>No data available for the selected feed type</Text>
              </div>
            )}
          </ChartContainer>
        </div>
      </Card>
      <Card className="w-full rounded-[.875rem] border border-neutral-200 p-4">
        <div className="flex">
          <ChartHeader
            title={`${perPondInterval.charAt(0).toUpperCase()}${perPondInterval
              .slice(1)
              .toLowerCase()} Feed Consumed by Pond`}
            action={<IntervalFilter value={perPondInterval} onChange={setPerPondInterval} />}
          />
        </div>
        <ChartContainer className="-ml-5 mt-[10px] w-full" config={feedConsumedByPondConfig}>
          <BarChart accessibilityLayer data={restructuredData} height={100} barCategoryGap={20}>
            <CartesianGrid />
            <XAxis dataKey="pondName" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={90}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />
              }
            />
            <Bar dataKey="totalQuantity" fill="#651391" radius={5} />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  )
}
