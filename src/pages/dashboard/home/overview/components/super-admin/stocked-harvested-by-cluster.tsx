'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

export const description = 'A multiple bar chart'

const chartData = [
  { month: 'Ajegunle', desktop: 186, mobile: 80 },
  { month: 'Vital', desktop: 305, mobile: 200 },
  { month: 'Camp 74', desktop: 237, mobile: 120 },
  { month: 'Kumbotso', desktop: 73, mobile: 190 },
  { month: 'Waziri', desktop: 209, mobile: 130 },
  { month: 'Eriwe', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Stocked',
    color: '#651391',
  },
  mobile: {
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
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" className="bg-white" />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
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
