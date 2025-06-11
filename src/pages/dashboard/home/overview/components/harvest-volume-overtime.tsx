import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'

export const description = 'A simple area chart'

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#651391',
  },
} satisfies ChartConfig

export function HarvestVolumeOvertime() {
  return (
    <Card className="w-full border-0">
      <CardContent>
        <Text className="mb-[20px] mt-[44px]">Harvest volume over time (kg) </Text>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="desktop" type="natural" fill="#B188C7" stroke="var(--color-desktop)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
