import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: 'Monthly Feed',
    color: '#651391B2',
  },
}

export default function MonthlyFeedConsumption() {
  return (
    <div className="mb-4 w-full rounded-[.875rem] border border-[#8686871A] p-4 shadow-lg">
      <div className="flex items-center justify-between py-4">
        <p className="text-sm font-semibold">Monthly Feed Consumption (kg)</p>
      </div>
      <ChartContainer config={monthlyFeedConfig}>
        <BarChart accessibilityLayer data={monthlyFeedData} height={100} barCategoryGap={8} margin={{ left: -40 }}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tick={false} tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="monthlyFeed" fill="#651391" radius={5}>
            <LabelList
              dataKey="monthlyFeed"
              position="insideTop"
              offset={12}
              className="fill-white"
              fontSize={20}
              formatter={(monthlyFeed: string) => `${monthlyFeed}%`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

const monthlyFeedData = [
  {
    month: 'January',
    monthlyFeed: '50',
  },
  {
    month: 'February',
    monthlyFeed: '40',
  },
  {
    month: 'March',
    monthlyFeed: '30',
  },
  {
    month: 'April',
    monthlyFeed: '20',
  },
  {
    month: 'May',
    monthlyFeed: '10',
  },
  {
    month: 'June',
    monthlyFeed: '60',
  },
  {
    month: 'July',
    monthlyFeed: '90',
  },
  {
    month: 'August',
    monthlyFeed: '70',
  },
  {
    month: 'September',
    monthlyFeed: '70',
  },
  {
    month: 'October',
    monthlyFeed: '30',
  },
  {
    month: 'November',
    monthlyFeed: '50',
  },
  {
    month: 'December',
    monthlyFeed: '10',
  },
]
