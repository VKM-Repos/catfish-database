import React from 'react'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
type DateRange = { from: Date; to: Date }

interface StockingHarvestOverviewProps {
  dateRange?: DateRange
}
export default function FishDistribution({ dateRange }: StockingHarvestOverviewProps) {
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
    { reason: 'Pond A', quantity: 50, fill: '#F1A8D3' },
    { reason: 'Pond B', quantity: 50, fill: '#FF9040' },
    { reason: 'Pond C', quantity: 50, fill: '#8085FF' },
  ]
  const chartConfig = {
    pondA: {
      label: 'Pond A',
      color: '#F1A8D3',
    },
    pondB: {
      label: 'Pond B',
      color: '#FF9040',
    },
    pondC: {
      label: 'Pond C',
      color: '#8085FF',
    },
  } satisfies ChartConfig
  const totalQuantity = chartData.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Card className="flex max-h-[400px] w-full items-center pr-4 lg:h-[400px] lg:min-h-[400px] lg:p-[24px]">
      <div className="flex w-full flex-col">
        <CardContent className="py-2 pl-2 pr-0 lg:p-6">
          <ChartHeader title={'Fish Distribution by Pond'} />

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
      </div>

      <FlexBox direction="col" className="w-fit min-w-fit text-gray-500 lg:w-full">
        {chartData?.map((item: any, index: number) => (
          <>
            <FlexBox direction="col" className="!gap-0 lg:!gap-4">
              <FlexBox key={index} align="center" gap="gap-2" justify="center">
                <div className="h-3 w-3 rounded-full lg:h-4 lg:w-4" style={{ backgroundColor: item?.fill }} />
                <span className="text-sm !capitalize">{item?.reason}</span>
              </FlexBox>
              <div className="ml-5">
                <span className=" text-sm !capitalize">
                  {item?.quantity} Fish <span className="hidden lg:inline">(30%)</span>
                </span>
              </div>
            </FlexBox>
          </>
        ))}
      </FlexBox>
    </Card>
  )
}
