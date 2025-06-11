import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { Card } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

const monthlyFeedConfig = {
  monthlyFeed: {
    label: '',
    color: '#651391B2',
  },
}

export default function FeedingInsight() {
  return (
    <Card className="h-[640px] max-h-[640px] w-full rounded-[.875rem] border border-neutral-200 p-4">
      <Text className="mb-[46px] text-[14px] font-semibold">Feed Insights</Text>
      <Text className="text-[14px] font-medium">Most used feed brands (%)</Text>
      <ChartContainer className="-ml-5 mt-[10px] w-full" config={monthlyFeedConfig}>
        <BarChart accessibilityLayer data={monthlyFeedData} height={100} barCategoryGap={20}>
          <CartesianGrid />
          <XAxis dataKey="feedType" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tick={false} tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel={false} className="!min-w-[10rem] bg-white !p-2" />}
          />
          <Bar dataKey="feedQuantity" fill="#651391" radius={5}>
            <LabelList
              dataKey="feedQuantity"
              position="insideTop"
              offset={12}
              className="fill-white"
              fontSize={14}
              formatter={(feedQuantity: string) => `${feedQuantity}%`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <FlexBox direction="col" className="mb-[50px] mt-[30px] w-full">
        <Text className="text-[14px] font-medium">Feed cost trends (₦/kg)</Text>
        <FlexBox className="w-full" direction="row">
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Lowest</Text>
            <Text className="text-[16px] font-semibold text-success-500">₦680</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Average</Text>
            <Text className="text-[16px] font-semibold">₦750</Text>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
            <Text className="font-medium leading-[20px]">Highest</Text>
            <Text className="text-[16px] font-semibold text-error-500">₦850</Text>
          </div>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}

const monthlyFeedData = [
  {
    feedType: 'Cppens',
    feedQuantity: '50',
  },
  {
    feedType: 'Vital',
    feedQuantity: '40',
  },
  {
    feedType: 'Topfeed',
    feedQuantity: '30',
  },
  {
    feedType: 'Blue Crown',
    feedQuantity: '20',
  },
]
