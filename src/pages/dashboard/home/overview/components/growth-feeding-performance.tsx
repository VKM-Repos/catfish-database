import { AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Text } from 'src/components/ui/text'
import { FlexBox } from 'src/components/ui/flexbox'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

const averageWeightConfig = {
  averageWeight: {
    label: 'Weight',
    color: '#651391B2',
  },
}

export default function GrowthFeedingPerformance() {
  const useGetFcr = createGetQueryHook({
    endpoint: '/dashboards/farmer/fcr/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['fcr-overall'],
  })
  const { data: fcr } = useGetFcr()
  return (
    <Card
      className=" mt-[40px] flex
     w-full items-center justify-between gap-5 rounded-[.875rem] border border-neutral-200 p-4"
    >
      <div className="w-[80%] gap-5">
        <ChartHeader title={'Growth & Feeding Performance'} />
        <ChartContainer config={averageWeightConfig}>
          <AreaChart accessibilityLayer data={averageWeightData}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#737780', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={100}
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
              content={<ChartTooltipContent indicator="dot" hideLabel={false} className=" bg-white" />}
            />
            <Area dataKey="averageWeight" type="linear" dot={true} stroke="#651391" fill="url(#colorWeight)" />
          </AreaChart>
        </ChartContainer>
      </div>
      <FlexBox className="w-[20%]" direction="col">
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Feed Conversion Ratio</Text>
          <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.fcrValue : 0}</Text>
          <Text className="text-[10px] font-medium text-success-500">Good</Text>
        </div>
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Total Feed Consumed</Text>
          <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.totalFeedConsumed : 0} kg</Text>
          <Text className="text-[10px] font-medium">For current production cycle</Text>
        </div>
        <div className="flex w-[250px] flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
          <Text className="font-medium leading-[20px]">Feed Cost</Text>
          <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.totalWeightGained : 0}</Text>
          <Text className="text-[10px] font-medium text-[#000AFF]">5.5 per kg</Text>
        </div>
      </FlexBox>
    </Card>
  )
}

const averageWeightData = [
  {
    month: 'Week 1',
    averageWeight: '10',
  },
  {
    month: 'Week 2',
    averageWeight: '15',
  },
  {
    month: 'Week 3',
    averageWeight: '20',
  },
  {
    month: 'Week 4',
    averageWeight: '25',
  },
  {
    month: 'Week 5',
    averageWeight: '30',
  },
  {
    month: 'Week 6',
    averageWeight: '35',
  },
  {
    month: 'Week 7',
    averageWeight: '40',
  },
  {
    month: 'Week 8',
    averageWeight: '45',
  },
  {
    month: 'Week 9',
    averageWeight: '50',
  },
  {
    month: 'Week 10',
    averageWeight: '55',
  },
  {
    month: 'Week 11',
    averageWeight: '60',
  },
  {
    month: 'Week 12',
    averageWeight: '65',
  },
  {
    month: 'Week 13',
    averageWeight: '0',
  },
  {
    month: 'Week 14',
    averageWeight: '0',
  },
  {
    month: 'Week 15',
    averageWeight: '0',
  },
]
