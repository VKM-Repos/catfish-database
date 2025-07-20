import React from 'react'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
type DateRange = { from: Date; to: Date }

interface StockingHarvestOverviewProps {
  dateRange?: DateRange
}
export default function StockingHarvestOverview({ dateRange }: StockingHarvestOverviewProps) {
  const useGetStockingHarvestData = createGetQueryHook({
    endpoint: '/dashboards/farmer/fish-availability',
    responseSchema: z.any(),
    queryKey: [`stocking-harvest-data`],
  })
  const { data: stockHarvestData } = useGetStockingHarvestData({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useMortalitySurvival = createGetQueryHook({
    endpoint: '/dashboards/farmer/mortality-rate/overall',
    responseSchema: z.any(),
    queryKey: [`mortality-survival-rate-overall`],
  })
  const { data: mortalitySurvival } = useMortalitySurvival({
    query: {
      interval: 'ALL',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const chartData = [
    { reason: 'stocked', quantity: stockHarvestData?.availableFish, fill: '#9C27B0' },
    { reason: 'harvested', quantity: stockHarvestData?.soldFish, fill: '#FF9040' },
  ]
  const chartConfig = {
    stocked: {
      label: 'Stocked',
      color: '#9C27B0',
    },
    harvested: {
      label: 'Harvested',
      color: '#FF9040',
    },
  } satisfies ChartConfig
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
                content={<ChartTooltipContent className="h-16 w-full bg-black text-white" nameKey="reason" />}
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
                    background: `${item.fill}`,
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
              <div className="relative max-w-full rounded-full bg-gray-200" style={{ width: '300px', height: '8px' }}>
                <div
                  className="max-w-full rounded-full"
                  style={{
                    backgroundColor: item.fill,
                    width: `${item.quantity / 100}px`,
                    maxWidth: '300px',
                    height: '8px',
                  }}
                />
              </div>
            </FlexBox>
          ))}
        </FlexBox>
        <FlexBox className="mt-[24px] w-full" direction="row">
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="normal">
              Survival Rate
            </Text>
            <Text size="lg" weight="semibold">
              {mortalitySurvival && mortalitySurvival[0]?.survivalRate}%
            </Text>
          </Card>
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="normal">
              Mortality Fish
            </Text>
            <Text size="lg" weight="semibold">
              {mortalitySurvival && mortalitySurvival[0]?.mortalityRate}%
            </Text>
          </Card>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
