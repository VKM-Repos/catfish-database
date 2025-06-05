import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'

const feedPriceConfig = {
  feedPrice: {
    label: 'Feed Price (₦)',
    color: '#651391B2',
  },
}

const feedPriceData = [
  { day: 'May 1', feedPrice: 3500 },
  { day: 'May 3', feedPrice: 3700 },
  { day: 'May 5', feedPrice: 4000 },
  { day: 'May 8', feedPrice: 4200 },
  { day: 'May 10', feedPrice: 4100 },
  { day: 'May 13', feedPrice: 4300 },
  { day: 'May 15', feedPrice: 4500 },
  { day: 'May 18', feedPrice: 4700 },
  { day: 'May 20', feedPrice: 5000 },
  { day: 'May 23', feedPrice: 5200 },
  { day: 'May 25', feedPrice: 5400 },
  { day: 'May 27', feedPrice: 6000 },
  { day: 'May 29', feedPrice: 7000 },
  { day: 'May 30', feedPrice: 8000 },
]

export default function FeedPriceTrends() {
  return (
    <Card className="h-[50rem] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader
        title={'Trend of feed prices per kg'}
        action={
          <Button variant="ghost" className="rotate-90">
            <SolarIconSet.MenuDots color="#A1A4AA" size={28} iconStyle="Bold" />
          </Button>
        }
      />
      <ChartContainer config={feedPriceConfig}>
        <AreaChart
          accessibilityLayer
          data={feedPriceData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          {/* Solid, equally spaced grid lines */}
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#737780', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[0, 9000]}
            tick={{ fill: '#737780', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            width={40}
            interval="preserveStartEnd"
            tickCount={10} // Show 10 equally spaced ticks (0, 1000, ..., 9000)
          />
          <defs>
            <linearGradient id="colorFeedPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#651391" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#651391" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white" />}
          />
          <Area dataKey="feedPrice" type="linear" stroke="#651391" fill="url(#colorFeedPrice)" />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
