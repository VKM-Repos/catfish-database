import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Interval, IntervalFilter } from 'src/components/ui/interval-filter'
import { DateRange } from 'src/components/ui/mega-datepicker'
import { useState } from 'react'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { averageWeightSchema } from 'src/schemas/clusterFarmerSchema'
import { Text } from 'src/components/ui/text'

const averageWeightConfig = {
  averageWeight: {
    label: 'Weight',
    color: '#651391B2',
  },
}

interface AverageWeightProps {
  dateRange?: DateRange
  farmerId?: string
}

export default function AverageWeight({ dateRange, farmerId }: AverageWeightProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetAverageWeight = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales',
    responseSchema: averageWeightSchema,
    queryKey: ['average-weight'],
  })

  const { data: averageWeight, isLoading: averWeigIsLoading } = useGetAverageWeight({
    query: {
      interval,
      farmerId: farmerId,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const hasNoData = (averageWeight?.length ?? 0) === 0

  return (
    <Card className="h-[30rem] w-full rounded-[.875rem] border border-neutral-200 p-4 md:w-[60%]">
      <ChartHeader
        title={'Average Weight'}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
          </div>
        }
      />
      <ChartContainer config={averageWeightConfig}>
        {averWeigIsLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading chart...</Text>
          </div>
        ) : hasNoData ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <AreaChart
            accessibilityLayer
            data={averageWeight}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="10 10" />
            <XAxis
              dataKey="intervalLabel"
              tick={{ fill: '#737780', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tick={{ fill: '#737780', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={20}
            />
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
            <Area dataKey="averageFishWeight" type="linear" stroke="#651391" fill="url(#colorWeight)" />
          </AreaChart>
        )}
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
