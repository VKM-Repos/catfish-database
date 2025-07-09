import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Card } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: '',
    color: '#651391B2',
  },
}

export default function FeedInsight() {
  const [selectedFeedType, setSelectedFeedType] = useState<string | null>(null)

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/super-admin/feed-consumption-trend?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend-super-admin'],
  })
  const { data: feedConsumed } = useGetFeedConsumed()

  const useGetFeedPriceSummary = createGetQueryHook({
    endpoint: '/dashboards/super-admin/feed-price-summary',
    responseSchema: z.any(),
    queryKey: ['feed-price-summary-summary-super-admin'],
  })
  const { data: feedPriceSummary } = useGetFeedPriceSummary()
  console.log(feedPriceSummary)

  const restructuredData = feedConsumed?.map((item: any) => ({
    feedType: item.feedType,
    quantityKg: item.dataPoints[0].quantityInKg,
  }))

  return (
    <Card className="h-[640px] max-h-[640px] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <Text className="mb-[46px] text-[14px] font-semibold">Feed Insights</Text>
      <Text className="text-[14px] font-medium">Most used feed brands (kg)</Text>
      <ChartContainer className="-ml-5 mt-[10px] w-full" config={monthlyFeedConfig}>
        <BarChart accessibilityLayer data={restructuredData} height={100} barCategoryGap={20}>
          <CartesianGrid />
          <XAxis dataKey="feedType" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tick={false} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#737780', fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={4} width={90} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="quantityKg" fill="#651391" radius={5}>
            <LabelList
              dataKey="quantityKg"
              position="insideTop"
              offset={12}
              className="fill-white"
              fontSize={14}
              formatter={(quantityKg: string) => `${quantityKg}kg`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <FlexBox direction="col" className="mb-[50px] mt-[30px] w-full">
        <Text className="text-[14px] font-medium">Feed cost trends (₦/kg)</Text>
        <FlexBox className="w-full" direction="row">
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Lowest</Text>
            <Text className="text-[16px] font-semibold text-success-500">₦{feedPriceSummary?.lowestPrice}</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Average</Text>
            <Text className="text-[16px] font-semibold">₦{feedPriceSummary?.averagePrice}</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Highest</Text>
            <Text className="text-[16px] font-semibold text-error-500">₦{feedPriceSummary?.highestPrice}</Text>
          </div>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
