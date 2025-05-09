import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import * as SolarIconSet from 'solar-icon-set'

const averageWeightConfig = {
  averageWeight: {
    label: 'Weight',
    color: '#651391B2',
  },
}

export default function AverageWeight() {
  return (
    <div className="h-full w-full rounded-[.875rem] border border-[#8686871A] p-4 shadow-lg md:w-[60%]">
      <div className="flex w-full items-center justify-between py-4">
        <p className="w-full whitespace-nowrap text-sm font-semibold">Average Weight</p>
        <div className="flex w-full cursor-pointer items-center justify-end gap-2">
          <SolarIconSet.MenuDots size={24} iconStyle="Bold" />
        </div>
      </div>
      <ChartContainer config={averageWeightConfig}>
        <AreaChart
          accessibilityLayer
          data={averageWeightData}
          margin={{
            left: 12,
            right: 12,
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
    </div>
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
