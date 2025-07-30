import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { z } from 'zod'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import * as SolarIconSet from 'solar-icon-set'

type Interval = 'DAILY' | 'MONTHLY' | 'YEARLY' | 'ALL'

function RevenueIntervalFilter({ interval, onChange }: { interval: Interval; onChange: (val: Interval) => void }) {
  const [open, setOpen] = useState(false)
  const options: Interval[] = ['DAILY', 'MONTHLY', 'YEARLY', 'ALL']

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="neutral" className="flex gap-x-2 !border bg-white capitalize">
          {interval.toLowerCase()} <SolarIconSet.AltArrowDown size={16} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-32 flex-col gap-1 p-2">
        {options.map((opt) => (
          <Button
            key={opt}
            variant={opt === interval ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start capitalize"
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
          >
            {opt.toLowerCase()}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

const useGetPondRevenue = createGetQueryHook({
  endpoint: 'dashboards/farmer/revenue/per-pond', // ← no hard-coded interval
  responseSchema: z.any(),
  queryKey: ['pond-revenue'], // base key; params are merged in
})

const pondRevenueConfig = {
  revenue: { label: 'Revenue', color: '#651391B2' },
}

export default function PondRevenue() {
  const [interval, setInterval] = useState<Interval>('DAILY')

  const { data: pondRevenue, isLoading } = useGetPondRevenue({
    query: { interval },
  })

  const transformedData =
    pondRevenue?.map((pond: any) => ({
      pond: pond.pondName,
      revenue: pond.revenueByInterval.reduce((sum: number, entry: any) => sum + entry.totalRevenue, 0),
    })) ?? []

  return (
    <Card className="h-[35rem] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <ChartHeader
        title="Pond Revenue (₦)"
        action={<RevenueIntervalFilter interval={interval} onChange={setInterval} />}
      />

      <ChartContainer className="h-[25rem] w-full" config={pondRevenueConfig}>
        <BarChart accessibilityLayer data={transformedData} height={100} barCategoryGap={20} margin={{ right: 40 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            dataKey="pond"
            tick={{
              fontSize: Math.max(6, 10 - transformedData?.length * 0.2), // Adjust these values as needed
            }}
            angle={transformedData?.length > 6 ? -45 : 0}
            tickLine={false}
            tickMargin={20} // Increased margin for angled text
            interval={0} // Critical - forces all labels to show
            height={60} // Give more vertical space for labels
            axisLine={false}
          />
          <YAxis
            domain={[0, 'auto']}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
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
