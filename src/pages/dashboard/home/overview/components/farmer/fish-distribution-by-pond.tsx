import React, { useMemo } from 'react'
import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { useAuthStore } from 'src/store/auth.store'
type DateRange = { from: Date; to: Date }

interface StockingHarvestOverviewProps {
  dateRange?: DateRange
}

// Helper to generate consistent colors
const COLORS = [
  '#F1A8D3',
  '#FF9040',
  '#8085FF',
  '#57D4FF',
  '#5CE3C2',
  '#FFCB4D',
  '#FD6F96',
  '#AA96DA',
  '#FF8C42',
  '#3EC300',
  '#0081A7',
  '#F07167',
  '#C1FBA4',
  '#A9DEF9',
  '#D291BC',
]

export default function FishDistribution({ dateRange }: StockingHarvestOverviewProps) {
  const user = useAuthStore((state) => state.user)
  const useGetFishDistrByPond = createGetQueryHook({
    endpoint: `/dashboards/farmer/${user?.id}/fish-availability-by-pond`,
    responseSchema: z.any(),
    queryKey: ['fish-distribution-by-pond'],
  })

  const { data: fishDistribution = [] } = useGetFishDistrByPond()

  const chartData = useMemo(() => {
    return fishDistribution.map((pond: any, index: number) => ({
      reason: pond.pondName,
      quantity: pond.totalAvailableFish,
      fill: COLORS[index % COLORS.length],
    }))
  }, [fishDistribution])

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    chartData.forEach((item: any) => {
      config[item.reason] = {
        label: item.reason,
        color: item.fill,
      }
    })
    return config
  }, [chartData])
  const totalQuantity = chartData.reduce((sum: any, item: any) => sum + item.quantity, 0)
  return (
    <Card className="flex max-h-[400px] w-full flex-col justify-between lg:h-[400px] lg:px-6 lg:py-4 lg:pr-4">
      <ChartHeader className="mt-2 px-3 pb-0 lg:mb-0 lg:mt-0 lg:px-0 " title={'Fish Distribution by Pond'} />
      <FlexBox direction="row" justify="between" className="w-full items-center lg:gap-4" gap="gap-0">
        <div className="flex w-2/3 flex-col lg:w-1/2">
          <CardContent className="p-0">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart width={250} height={250}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className="h-16 w-full bg-black text-white" nameKey="reason" />}
                />
                <Pie data={chartData} dataKey="quantity" nameKey="reason" innerRadius={60} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </div>

        {/* Scrollable Legend */}
        <div className="align-center flex  max-h-[200px] w-1/3 flex-col justify-center overflow-y-auto lg:w-1/2 lg:px-2">
          {chartData.map((item: any, index: any) => {
            const percentage = ((item.quantity / totalQuantity) * 100).toFixed(2)
            return (
              <FlexBox key={index} direction="col" className="mb-2 !gap-0 lg:!gap-4">
                <FlexBox align="center" gap="gap-2" justify="center">
                  <div className="h-3 w-3 rounded-full lg:h-4 lg:w-4" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm !capitalize">{item.reason}</span>
                </FlexBox>
                <div className="ml-5">
                  <span className="text-muted-foreground text-xs">
                    {item.quantity.toLocaleString()} Fish <span className="hidden lg:inline">({percentage}%)</span>
                  </span>
                </div>
              </FlexBox>
            )
          })}
        </div>
      </FlexBox>
    </Card>
  )
}
