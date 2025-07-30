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

  console.log('fishDistribution', fishDistribution)

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
    <Card className="flex h-[400px] max-h-[400px] w-full items-center">
      <div className="flex w-1/2 flex-col">
        <CardContent>
          <ChartHeader className="mb-6 pb-0" title={'Fish Distribution by Pond'} />

          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart width={250} height={250}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="h-16 w-full bg-black text-white" nameKey="reason" />}
              />
              <Pie data={chartData} dataKey="quantity" nameKey="reason" innerRadius={60} outerRadius={100} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </div>

      {/* Scrollable Legend */}
      <div className="align-center justity-center flex max-h-[200px] w-1/2 flex-col overflow-y-auto px-2">
        {chartData.map((item: any, index: any) => {
          const percentage = ((item.quantity / totalQuantity) * 100).toFixed(2)
          return (
            <FlexBox key={index} direction="col" className="mb-2">
              <FlexBox align="center" gap="gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm !capitalize">{item.reason}</span>
              </FlexBox>
              <span className="text-muted-foreground text-xs">
                {item.quantity.toLocaleString()} Fish ({percentage}%)
              </span>
            </FlexBox>
          )
        })}
      </div>
    </Card>
  )
}
