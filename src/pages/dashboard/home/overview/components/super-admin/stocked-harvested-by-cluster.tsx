'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

export const description = 'A multiple bar chart'

const chartData = [
  { feedType: 'Ajegunle', stocked: 186, harvested: 80 },
  { feedType: 'Vital', stocked: 305, harvested: 200 },
  { feedType: 'Camp 74', stocked: 237, harvested: 120 },
  { feedType: 'Kumbotso', stocked: 73, harvested: 190 },
  { feedType: 'Waziri', stocked: 209, harvested: 130 },
  { feedType: 'Eriwe', stocked: 214, harvested: 140 },
]

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

export function StockedHarvestedByCluster() {
  return (
    <Card className="h-[450px] max-h-[450px] min-h-[450px] w-full border border-neutral-200 p-[16px]">
      <CardContent>
        <Text className="mb-[20px]  font-semibold">Stocked vs. Harvested by Cluster</Text>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey="feedType" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" className="bg-white" />} />
            <Bar dataKey="stocked" fill="var(--color-stocked)" radius={4} />
            <Bar dataKey="harvested" fill="var(--color-harvested)" radius={4} />
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
