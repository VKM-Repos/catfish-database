'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

export const description = 'A bar chart'

const chartData = [
  { month: 'Coppens', desktop: 186 },
  { month: 'Vitals', desktop: 305 },
  { month: 'Topfeed', desktop: 237 },
  { month: 'Blue crown', desktop: 73 },
]

const chartConfig = {
  desktop: {
    label: 'Value',
    color: '#651391',
  },
} satisfies ChartConfig

export function FeedInsight() {
  return (
    <Card className="h-[630px] max-h-[630px] min-h-[630px] w-full border border-neutral-200 p-[16px]">
      <CardContent>
        <Text className="mb-[20px]  font-semibold">Feed Insights</Text>
        <Text className="mb-[10px] text-[14px]">Most used feed brands (%)</Text>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
              min={0}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
        <FlexBox className="mt-[40px] w-full" direction="col">
          <Text className="mb-[20px]  font-semibold">Feed Price Summary</Text>
          <FlexBox className="w-full" justify="around">
            <div className="w-full rounded-[4px] border border-neutral-200 p-[10px]">
              <Text className="text-[14px] font-medium">Lowest</Text>
              <Text className="text-[16px] text-success-500">₦680/kg</Text>
            </div>
            <div className="w-full rounded-[4px] border border-neutral-200 p-[10px]">
              <Text className="text-[14px] font-medium">Average</Text>
              <Text className="text-[16px] text-black">₦750/kg</Text>
            </div>
            <div className="w-full rounded-[4px] border border-neutral-200 p-[10px]">
              <Text className="text-[14px] font-medium">Highest</Text>
              <Text className="text-[16px] text-error-500">₦850/kg</Text>
            </div>
          </FlexBox>
        </FlexBox>
      </CardContent>
    </Card>
  )
}
