import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Pie, PieChart } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'

const chartData = [
  { reason: 'feed', quantity: 275, fill: '#9C27B0' },
  { reason: 'fingerlings', quantity: 200, fill: '#8C4EAD' },
  { reason: 'maintenance', quantity: 187, fill: '#B188C7' },
  { reason: 'labour', quantity: 173, fill: '#D8C4E3' },
  { reason: 'other', quantity: 90, fill: '#F0E8F4' },
]
const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  feed: {
    label: 'Feed',
    color: '#9C27B0',
  },
  fingerlings: {
    label: 'Fingerlings',
    color: '#8C4EAD',
  },
  maintenance: {
    label: 'Maintenance',
    color: '#B188C7',
  },
  labour: {
    label: 'Labour',
    color: '#D8C4E3',
  },
  other: {
    label: 'Other',
    color: '#F0E8F4',
  },
} satisfies ChartConfig
export default function CostBreakdownOverview() {
  return (
    <Card className="flex  h-[400px] max-h-[400px] min-h-[400px] w-full items-center p-[24px]">
      <div className="flex w-full flex-col">
        <ChartHeader title={'Cost Breakdown'} />
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] px-0">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent className="h-16 w-10 bg-black text-white" nameKey="quantity" />}
              />
              <Pie width={250} height={250} data={chartData} dataKey="quantity" labelLine={false} nameKey="reason" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </div>
      <FlexBox className="w-full" direction="row" align="center">
        <FlexBox direction="col" className="w-full gap-2">
          {chartData.map((item, index) => (
            <FlexBox key={index} align="center" gap="gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm">{item.reason}</span>
            </FlexBox>
          ))}
        </FlexBox>
        <FlexBox className="mt-[24px] w-full" direction="col">
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="medium">
              Cost per Kg of Fish
            </Text>
            <Text size="lg" weight="semibold">
              87%
            </Text>
            <Text size="xs">At market average</Text>
          </Card>
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="medium">
              Cost per Fish
            </Text>
            <Text size="lg" weight="semibold">
              13%
            </Text>
            <Text size="xs">At market average</Text>
          </Card>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
