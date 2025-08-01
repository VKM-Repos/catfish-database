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
    <Card className="flex h-[400px] max-h-[400px] w-full items-center px-2 pb-2  lg:h-[400px] lg:min-h-[400px]  lg:p-[24px] ">
      <div className="flex h-full w-full flex-col justify-between">
        <CardContent className="space-y-7 px-0 py-2 lg:space-y-0 lg:p-6">
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
          {/* Calculate max quantity once */}
          {(() => {
            const maxQuantity = Math.max(...chartData.map((item) => item.quantity), 1) // Ensure at least 1 to avoid division by zero

            return chartData.map((item, index) => (
              <FlexBox className="w-full text-gray-500" key={index} gap="gap-2" direction="col">
                <div className="flex w-full flex-col items-start justify-between text-[14px] font-medium lg:flex-row lg:items-center">
                  <span className="text-sm">{item.reason}</span>
                  <span className="text-sm">{item.quantity}</span>
                </div>

                <div className="relative h-[8px] w-full rounded-full bg-gray-200 ">
                  <div
                    className="h-[8px] rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: item.fill,
                      width: `${(item.quantity / maxQuantity) * 100}%`,
                      maxWidth: '100%',
                      height: '8px',
                      transition: 'width 0.3s ease', // Optional: Add smooth animation
                    }}
                  />
                </div>
              </FlexBox>
            ))
          })()}
        </FlexBox>
        <FlexBox className="mt-[24px] flex-col lg:w-full lg:flex-row" direction="row">
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
