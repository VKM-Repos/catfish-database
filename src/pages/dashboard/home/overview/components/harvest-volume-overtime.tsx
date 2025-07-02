import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'

export const description = 'A simple area chart'

const chartData = [
  { month: 'January', quantity: 186 },
  { month: 'February', quantity: 305 },
  { month: 'March', quantity: 237 },
  { month: 'April', quantity: 73 },
  { month: 'May', quantity: 209 },
  { month: 'June', quantity: 214 },
]

const chartConfig = {
  totalQuantity: {
    label: 'Quantity',
    color: '#651391',
  },
} satisfies ChartConfig

export function HarvestVolumeOvertime({ harvestTrends }: { harvestTrends: any }) {
  console.log(harvestTrends, '...')

  return (
    <Card className="w-full border-0">
      <CardContent>
        <Text className="mb-[20px] mt-[44px]">Harvest volume over time (kg) </Text>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={harvestTrends}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="intervalLabel" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={90} // Slightly wider for numbers
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="totalQuantity" type="natural" fill="#B188C7" stroke="var(--color-totalQuantity)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
