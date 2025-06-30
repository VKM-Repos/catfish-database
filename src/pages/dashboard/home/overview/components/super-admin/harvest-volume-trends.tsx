import React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'

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
  const useGetRevenuePrice = createGetQueryHook({
    endpoint: '/dashboards/super-admin/volume-of-sales?interval=MONTHLY',
    responseSchema: z.any(),
    queryKey: ['sales-revenue-price-trends-super-admin'],
  })
  const { data: salesRevenue } = useGetRevenuePrice()
  console.log(salesRevenue)

  return (
    <Card className="h-[450px] max-h-[450px] min-h-[450px] w-full border border-neutral-200 p-[16px] ">
      <CardContent>
        <Text className="mb-[20px]  font-semibold">Harvest Volume Trend </Text>

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={salesRevenue}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="intervalLabel"
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
            <Line dataKey="totalQuantity" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
