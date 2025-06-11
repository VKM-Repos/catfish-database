import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent } from 'src/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'

export const description = 'A multiple line chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#651391',
  },
  mobile: {
    label: 'Mobile',
    color: '#0DA500',
  },
} satisfies ChartConfig

export function LineChartHarvestVolume() {
  return (
    <Card className="w-full border-0">
      <CardContent>
        <Text className="mb-[20px] mt-[44px]">Harvest volume over time (kg) </Text>

        <ChartContainer config={chartConfig}>
          <LineChart
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={true} />
            <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
