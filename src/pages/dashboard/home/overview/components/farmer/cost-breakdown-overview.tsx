import { ChartHeader } from 'src/components/global/chart-header'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Pie, PieChart } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

type DateRange = { from: Date; to: Date }

interface CostBreakdownOverviewProps {
  dateRange?: DateRange
}
export default function CostBreakdownOverview({ dateRange }: CostBreakdownOverviewProps) {
  const useGetMaintenanceData = createGetQueryHook({
    endpoint: '/dashboards/farmer/maintenance-cost/breakdown',
    responseSchema: z.any(),
    queryKey: ['maintenance-cost-data'],
  })
  const { data: maintenanceCostData } = useGetMaintenanceData({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetAveragePrice = createGetQueryHook({
    endpoint: '/dashboards/farmer/average-price',
    responseSchema: z.any(),
    queryKey: ['average-price'],
  })
  const { data: averagePrice } = useGetAveragePrice({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const colorMap: any = {
    CHEMICALS: '#9C27B0',
    ENERGY: '#8C4EAD',
    EQUIPMENT: '#B188C7',
    LABOR: '#D8C4E3',
    OTHER: '#F0E8F4',
  }
  const dataWithColors = maintenanceCostData?.map((item: any) => ({
    ...item,
    fill: colorMap[item.maintenanceType] || '#CCCCCC',
  }))
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    LABOR: {
      label: 'LABOR',
      color: '#9C27B0',
    },
    CHEMICALS: {
      label: 'CHEMICALS',
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
  return (
    <Card className="flex max-h-[400px] w-full items-center border-neutral-200   pl-2  lg:h-[400px] lg:min-h-[400px] lg:p-[24px] ">
      <div className="flex h-full w-full flex-col justify-between">
        <ChartHeader title={'Cost Breakdown'} />
        <CardContent className="p-0 lg:p-6">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] px-0">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent className="h-16 w-10 bg-black text-white" nameKey="totalCost" />}
              />
              <Pie
                width={250}
                height={250}
                data={dataWithColors}
                dataKey="totalCost"
                labelLine={false}
                nameKey="maintenanceType"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </div>
      <FlexBox className="h-full w-fit lg:w-full" direction="row" align="center">
        <FlexBox direction="col" className="h-full w-fit gap-0 lg:h-fit lg:w-full lg:gap-2" justify="end">
          {dataWithColors?.map((item: any, index: number) => (
            <FlexBox key={index} align="end" gap="gap-2" className="gap-0 lg:gap-2">
              <div className="h-2 w-2  rounded-full lg:h-4 lg:w-4" style={{ backgroundColor: item?.fill }} />
              <span className="text-[10px] lg:text-sm">{item?.maintenanceType}</span>
            </FlexBox>
          ))}
        </FlexBox>
        <FlexBox className="mt-[24px] hidden w-full lg:flex" direction="col">
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="medium">
              Cost per Kg of Fish
            </Text>
            <Text size="lg" weight="semibold">
              ₦152
            </Text>
            <Text size="xs">At market average</Text>
          </Card>
          <Card className="w-full p-[10px]">
            <Text size="sm" weight="medium">
              Cost per Fish
            </Text>
            <Text size="lg" weight="semibold">
              ₦{averagePrice?.averagePrice}
            </Text>
            <Text size="xs">At market average</Text>
          </Card>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
