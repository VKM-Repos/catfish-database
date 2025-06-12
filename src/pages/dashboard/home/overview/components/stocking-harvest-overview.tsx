import React from 'react'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'

const chartData = [
  { reason: 'stocked', quantity: 10000, fill: '#9C27B0' },
  { reason: 'harvested', quantity: 7000, fill: '#FF9040' },
]
const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  stocked: {
    label: 'Stocked',
    color: '#9C27B0',
  },
  harvested: {
    label: 'Harvested',
    color: '#FF9040',
  },
} satisfies ChartConfig
export default function StockingHarvestOverview() {
  const totalQuantity = chartData.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Card className="flex h-[400px] max-h-[400px] min-h-[400px] w-full items-center p-[24px]">
      <div className="flex w-full flex-col">
        <CardContent>
          <ChartHeader title={'Stocking & Harvest Overview'} />

          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="h-16 w-[100px] bg-black text-white" nameKey="reason" />}
              />
              <Pie width={250} height={250} data={chartData} dataKey="quantity" nameKey="reason" innerRadius={60} />
            </PieChart>
          </ChartContainer>
        </CardContent>

        <FlexBox direction="row" align="center" justify="center" className="w-full gap-2">
          {chartData.map((item, index) => {
            const percent = (item.quantity / totalQuantity) * 100
            return (
              <FlexBox key={index} align="center" gap="gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    background: `conic-gradient(${item.fill} 0% ${percent}%, #e5e7eb ${percent}% 100%)`,
                  }}
                />
                <span className="text-sm">{item.reason}</span>
              </FlexBox>
            )
          })}
        </FlexBox>
      </div>
      <FlexBox className="w-full" direction="col">
        <FlexBox direction="col" className="w-full gap-2">
          {chartData.map((item, index) => (
            <FlexBox className="w-full" key={index} gap="gap-2" direction="col">
              <div className="flex w-full items-center justify-between text-[14px] font-medium">
                <span className="text-sm">{item.reason}</span>
                <span className="text-sm">{item.quantity}</span>
              </div>
              <div
                className="rounded-full"
                style={{ backgroundColor: item.fill, width: `${item.quantity / 50}px`, height: '8px' }}
              />
            </FlexBox>
          ))}
        </FlexBox>
        <FlexBox className="mt-[24px] w-full" direction="row">
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="normal">
              Survival Rate
            </Text>
            <Text size="lg" weight="semibold">
              87%
            </Text>
          </Card>
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="normal">
              Harvested Fish
            </Text>
            <Text size="lg" weight="semibold">
              13%
            </Text>
          </Card>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
