import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'

const averageWeightConfig = {
  averageWeight: {
    label: 'Weight',
    color: '#651391B2',
  },
}

export default function AverageWeight() {
  return (
    <Card className="h-[30rem] w-full rounded-[.875rem] border border-neutral-200 p-4 md:w-[60%]">
      <ChartHeader
        title={'Average Weight'}
        action={
          <Button variant="ghost" className="rotate-90">
            <SolarIconSet.MenuDots color="#A1A4AA" size={28} iconStyle="Bold" />
          </Button>
        }
      />
      <ChartContainer config={averageWeightConfig}>
        <AreaChart
          accessibilityLayer
          data={averageWeightData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="10 10" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#737780', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tick={{ fill: '#737780', fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={4} width={20} />
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#651391" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#651391" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white" />}
          />
          <Area dataKey="averageWeight" type="linear" stroke="#651391" fill="url(#colorWeight)" />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}

const averageWeightData = [
  {
    month: 'January',
    averageWeight: '50',
  },
  {
    month: 'February',
    averageWeight: '40',
  },
  {
    month: 'March',
    averageWeight: '30',
  },
  {
    month: 'April',
    averageWeight: '20',
  },
  {
    month: 'May',
    averageWeight: '10',
  },
  {
    month: 'June',
    averageWeight: '60',
  },
  {
    month: 'July',
    averageWeight: '90',
  },
  {
    month: 'August',
    averageWeight: '70',
  },
  {
    month: 'September',
    averageWeight: '70',
  },
  {
    month: 'October',
    averageWeight: '30',
  },
  {
    month: 'November',
    averageWeight: '50',
  },
  {
    month: 'December',
    averageWeight: '10',
  },
]
