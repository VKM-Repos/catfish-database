import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { ChartHeader } from 'src/components/global/chart-header'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: '',
    color: '#651391B2',
  },
}

type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type DateRange = { from: Date; to: Date }

function SelectPopover<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (newVal: T) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="neutral" size="sm" className="flex gap-x-2 !border border-neutral-200 bg-white capitalize">
          {label} <SolarIconSet.AltArrowDown size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex max-h-64 w-40 flex-col gap-1 overflow-y-scroll p-2">
        {options.map((opt) => (
          <Button
            key={opt}
            variant={opt === value ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start capitalize"
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
          >
            {opt.replaceAll('_', ' ').toLowerCase()}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}
interface FeedingInsightProps {
  dateRange?: DateRange
}

export default function FeedInsight({ dateRange }: FeedingInsightProps) {
  const [selectedFeedType, setSelectedFeedType] = useState<string | null>(null)
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetFeedConsumed = createGetQueryHook({
    endpoint: '/dashboards/super-admin/feed-consumption-trend',
    responseSchema: z.any(),
    queryKey: ['most-feed-consumed-trend-super-admin'],
  })
  const { data: feedConsumed } = useGetFeedConsumed({
    query: {
      interval,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetFeedPriceSummary = createGetQueryHook({
    endpoint: '/dashboards/super-admin/feed-price-summary',
    responseSchema: z.any(),
    queryKey: ['feed-price-summary-summary-super-admin'],
  })
  const { data: feedPriceSummary } = useGetFeedPriceSummary()
  console.log(feedPriceSummary)

  const restructuredData = feedConsumed?.map((item: any) => ({
    feedType: item.feedType,
    quantityKg: item.dataPoints[0].quantityInKg,
  }))

  return (
    <Card className="h-[640px] max-h-[640px] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <div className="flex">
        <ChartHeader
          title={`${interval.charAt(0).toUpperCase()}${interval.slice(1).toLowerCase()} Feed Insights`}
          action={<IntervalFilter value={interval} onChange={setInterval} />}
        />
      </div>
      <Text className="text-[14px] font-medium">Most used feed brands (kg)</Text>
      <ChartContainer className="-ml-5 mt-[10px] w-full" config={monthlyFeedConfig}>
        <BarChart accessibilityLayer data={restructuredData} height={100} barCategoryGap={10}>
          <CartesianGrid />
          <XAxis
            dataKey="feedType"
            // tick={<CustomizedAxisTick />}
            tick={{ fontSize: 8 }}
            angle={-30}
            tickLine={false}
            tickMargin={8}
            hide={false}
            axisLine={true}
          />
          <YAxis tick={{ fill: '#737780', fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={4} width={90} />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="quantityKg" fill="#651391" radius={5} />
        </BarChart>
      </ChartContainer>
      <FlexBox direction="col" className="mb-[50px] mt-[30px] w-full">
        <Text className="text-[14px] font-medium">Feed cost trends (₦/kg)</Text>
        <FlexBox className="w-full" direction="row">
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Lowest</Text>
            <Text className="text-[16px] font-semibold text-success-500">₦{feedPriceSummary?.lowestPrice}</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Average</Text>
            <Text className="text-[16px] font-semibold">₦{feedPriceSummary?.averagePrice}</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Highest</Text>
            <Text className="text-[16px] font-semibold text-error-500">₦{feedPriceSummary?.highestPrice}</Text>
          </div>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
