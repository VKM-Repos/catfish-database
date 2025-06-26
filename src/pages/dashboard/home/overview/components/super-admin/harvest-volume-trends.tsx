import React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'

const chartData = [
  { month: 'Q1', value: 5, mobile: 80 },
  { month: 'Q2', value: 20, mobile: 80 },
  { month: 'Q3', value: 30, mobile: 200 },
  { month: 'Q4', value: 10, mobile: 120 },
  { month: 'Q5', value: 60, mobile: 190 },
  { month: 'Q6', value: 70, mobile: 130 },
  { month: 'Q7', value: 90, mobile: 140 },
]

const chartConfig = {
  value: {
    label: 'Value',
    color: '#651391',
  },
  mobile: {
    label: 'Mobile',
    color: '#0DA500',
  },
} satisfies ChartConfig
export default function HarvestVolumeTrends() {
  return (
    <Card className="h-[450px] max-h-[450px] min-h-[450px] w-full border border-neutral-200 p-[16px] ">
      <CardContent>
        <Text className="mb-[20px]  font-semibold">Harvest Volume Trend </Text>

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
              max={100}
              min={0}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
