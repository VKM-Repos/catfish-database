import { AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Text } from 'src/components/ui/text'
import { FlexBox } from 'src/components/ui/flexbox'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { useEffect, useState } from 'react'

const averageWeightConfig = {
  averageWeight: {
    label: 'Consumed',
    color: '#651391B2',
  },
}

export default function GrowthFeedingPerformance() {
  const [selectedFeedType, setSelectedFeedType] = useState<string | null>(null)
  const useGetFcr = createGetQueryHook({
    endpoint: '/dashboards/farmer/fcr/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['fcr-overall'],
  })
  const { data: fcr } = useGetFcr()

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed-consumption-trend?interval=WEEKLY',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend'],
  })
  const { data: feedConsumed } = useGetFeedConsumed()

  // Set the feed type with most data points as default
  useEffect(() => {
    if (feedConsumed && feedConsumed.length > 0 && !selectedFeedType) {
      // Find the feed type with most data points
      const feedWithMostData = feedConsumed.reduce((prev: any, current: any) =>
        prev.dataPoints.length > current.dataPoints.length ? prev : current,
      )
      setSelectedFeedType(feedWithMostData.feedType)
    }
  }, [feedConsumed, selectedFeedType])

  // Transform the API data into chart format based on selected feed type
  const getChartData = () => {
    if (!selectedFeedType || !feedConsumed) return []

    // Find the selected feed type data
    const selectedFeedData = feedConsumed.find((feed: any) => feed.feedType === selectedFeedType)

    if (!selectedFeedData) return []

    // Transform data points into chart format
    return selectedFeedData.dataPoints.map((point: any) => ({
      period: point.intervalLabel,
      averageWeight: point.quantityInKg,
    }))
  }

  const chartData = getChartData()

  return (
    <Card
      className=" mt-[40px] flex
     w-full items-center justify-between gap-5 rounded-[.875rem] border border-neutral-200 p-4"
    >
      <div className="w-[80%] gap-5">
        <div className="flex">
          <ChartHeader title={'Feed Consumed'} />
          <div>
            <Select value={selectedFeedType || ''} onValueChange={(value) => setSelectedFeedType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select feed type" />
              </SelectTrigger>
              <SelectContent>
                {feedConsumed?.map((feed: any) => (
                  <SelectItem key={feed.feedType} value={feed.feedType}>
                    {feed.feedType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                width={90} // Slightly wider for numbers
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
      <FlexBox className="w-[20%]" direction="col">
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Feed Conversion Ratio</Text>
          <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.fcrValue : 0}</Text>
          <Text className="text-[10px] font-medium text-success-500">Good</Text>
        </div>
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Total Feed Consumed</Text>
          <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.totalFeedConsumed : 0} kg</Text>
          <Text className="text-[10px] font-medium">For current production cycle</Text>
        </div>
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Feed Cost</Text>
          <Text className="text-[16px] font-semibold">₦{fcr ? fcr[0]?.totalWeightGained : 0}</Text>
          <Text className="text-[10px] font-medium text-[#000AFF]">5.5 per kg</Text>
        </div>
      </FlexBox>
    </Card>
  )
}

const averageWeightData = [
  {
    period: 'Week 1',
    averageWeight: '10',
  },
  {
    period: 'Week 2',
    averageWeight: '15',
  },
  {
    period: 'Week 3',
    averageWeight: '20',
  },
  {
    period: 'Week 4',
    averageWeight: '25',
  },
  {
    period: 'Week 5',
    averageWeight: '90',
  },
]
