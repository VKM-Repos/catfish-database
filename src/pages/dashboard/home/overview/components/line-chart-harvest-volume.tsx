import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'

export const description = 'A multiple line chart'

const chartData = [
  { period: 'January', revenue: 186, price: 80 },
  { period: 'February', revenue: 305, price: 200 },
  { period: 'March', revenue: 237, price: 120 },
  { period: 'April', revenue: 73, price: 190 },
  { period: 'May', revenue: 209, price: 130 },
  { period: 'June', revenue: 214, price: 140 },
]

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#651391',
  },
  price: {
    label: 'Price',
    color: '#0DA500',
  },
} satisfies ChartConfig

export function LineChartHarvestVolume() {
  const useGetRevenuePrice = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales?interval=MONTHLY',
    responseSchema: z.any(),
    queryKey: ['revenue-and-price-trends-cluster-manager'],
  })
  const { data: revenuePrice } = useGetRevenuePrice()
  const restructuredData = revenuePrice?.map((item: any) => ({
    period: item?.intervalLabel,
    revenue: item?.totalRevenue,
    price: item?.averageSellingPrice,
  }))

  return (
    <Card className="w-full border-0">
      <CardContent>
        <Text className="mb-[20px] mt-[44px]">Revenue & Average Price Trends</Text>

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={restructuredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={90}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
            <Line dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
