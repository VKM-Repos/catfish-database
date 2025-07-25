import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Interval, IntervalFilter } from 'src/components/ui/interval-filter'
import { DateRange } from 'src/components/ui/mega-datepicker'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: '',
    color: '#651391B2',
  },
}

interface MonthlyFeedConsumptionProps {
  dateRange?: DateRange
  farmerId?: string
}

const useFeedConsumptionTrend = createGetQueryHook({
  endpoint: '/dashboards/cluster/feed-consumption-trend',
  responseSchema: z.any(),
  queryKey: ['feed-consumption-trend'],
})

export default function MonthlyFeedConsumption({ dateRange, farmerId }: MonthlyFeedConsumptionProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const { data: feedData, isLoading } = useFeedConsumptionTrend({
    query: {
      interval,
      farmerId,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const restructuredData = feedData?.map((item: any) => item.dataPoints[0])

  const hasNoData = (feedData?.length ?? 0) === 0

  return (
    <Card className="h-[35rem] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader
        title={'Monthly feed consumption (kg)'}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
          </div>
        }
      />
      <ChartContainer className="h-[25rem] w-full " config={monthlyFeedConfig}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading chart...</Text>
          </div>
        ) : hasNoData ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <BarChart accessibilityLayer data={restructuredData} height={100} barCategoryGap={20} margin={{ right: 40 }}>
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="intervalLabel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tick={false} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />
              }
            />
            <Bar dataKey="quantityInKg" fill="#651391" radius={5}></Bar>
          </BarChart>
        )}
      </ChartContainer>
    </Card>
  )
}

const monthlyFeedData = [
  {
    month: 'January',
    monthlyFeed: '50',
  },
  {
    month: 'February',
    monthlyFeed: '40',
  },
  {
    month: 'March',
    monthlyFeed: '30',
  },
  {
    month: 'April',
    monthlyFeed: '20',
  },
  {
    month: 'May',
    monthlyFeed: '10',
  },
  {
    month: 'June',
    monthlyFeed: '60',
  },
  {
    month: 'July',
    monthlyFeed: '90',
  },
  {
    month: 'August',
    monthlyFeed: '70',
  },
  {
    month: 'September',
    monthlyFeed: '70',
  },
  {
    month: 'October',
    monthlyFeed: '30',
  },
  {
    month: 'November',
    monthlyFeed: '50',
  },
  {
    month: 'December',
    monthlyFeed: '10',
  },
]
