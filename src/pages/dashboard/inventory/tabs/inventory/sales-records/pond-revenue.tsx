import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'

// Generate a random number of ponds between 4 and 6
const pondCount = Math.floor(Math.random() * 3) + 4 // 4 to 6

// Generate mock pond revenue data
const pondRevenueData = Array.from({ length: pondCount }).map((_, idx) => ({
  pond: `Pond ${String.fromCharCode(65 + idx)}`, // Pond A, Pond B, ...
  revenue: Math.floor(Math.random() * 9000000) + 1000000, // ₦1,000,000 to ₦10,000,000
}))

const pondRevenueConfig = {
  revenue: {
    label: 'Revenue',
    color: '#651391B2',
  },
}

export default function PondRevenue() {
  return (
    <Card className="h-[35rem] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader title={'Pond Revenue (₦)'} action={null} />
      <ChartContainer className="h-[25rem] w-full" config={pondRevenueConfig}>
        <BarChart accessibilityLayer data={pondRevenueData} height={100} barCategoryGap={20} margin={{ right: 40 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis dataKey="pond" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis
            domain={[0, 10000000]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="revenue" fill="#651391" radius={5}>
            <LabelList
              dataKey="revenue"
              position="insideTop"
              offset={12}
              className="fill-white"
              fontSize={14}
              formatter={(revenue: number) => `₦${revenue.toLocaleString()}`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
