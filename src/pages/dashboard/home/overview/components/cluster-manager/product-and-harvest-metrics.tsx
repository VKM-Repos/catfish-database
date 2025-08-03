import React from 'react'
import { Card } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { HarvestVolumeOvertime } from './harvest-volume-overtime'
import { LineChartHarvestVolume } from './line-chart-harvest-volume'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { formatNumber } from 'src/lib/utils'
type DateRange = { from: Date; to: Date }
interface ProductAndHarvestMetricsProps {
  dateRange?: DateRange
}

export default function ProductAndHarvestMetrics({ dateRange }: ProductAndHarvestMetricsProps) {
  const useGetSalesVolume = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['sales-volume-cluster-manager'],
  })
  const { data: salesVolume } = useGetSalesVolume()

  return (
    <Card className="border border-neutral-200 p-[24px]">
      {
        <FlexBox>
          <Card className="w-full p-[10px]">
            <FlexBox direction="col" gap="gap-1">
              <Text size="sm" weight="medium">
                Total harvest volume
              </Text>
              <Text size="lg" weight="semibold">
                {salesVolume && formatNumber(salesVolume[0]?.totalWeight !== null ? salesVolume[0]?.totalWeight : 0)} kg
              </Text>
              <Text size="xs">YTD</Text>
            </FlexBox>
          </Card>
          <Card className="w-full p-[10px]">
            <FlexBox direction="col" gap="gap-1">
              <Text size="sm" weight="medium">
                Average selling price
              </Text>
              <Text size="lg" weight="semibold">
                ₦{salesVolume && salesVolume[0]?.averageSellingPrice}
              </Text>
              <Text size="xs">Current</Text>
            </FlexBox>
          </Card>
          <Card className="w-full p-[10px]">
            <FlexBox direction="col" gap="gap-1">
              <Text size="sm" weight="medium">
                Total revenue
              </Text>
              <Text size="lg" weight="semibold">
                ₦{salesVolume && salesVolume[0]?.totalRevenue}
              </Text>
              <Text size="xs">YTD</Text>
            </FlexBox>
          </Card>
          <Card className="w-full p-[10px]">
            <FlexBox direction="col" gap="gap-1">
              <Text size="sm" weight="medium">
                Average fish weight
              </Text>
              <Text size="lg" weight="semibold">
                {salesVolume && salesVolume[0]?.averageFishWeight} kg
              </Text>
              <Text size="xs">Current</Text>
            </FlexBox>
          </Card>
        </FlexBox>
      }

      <FlexBox className="lg:flex-row" direction="col">
        <HarvestVolumeOvertime dateRange={dateRange} />
        <LineChartHarvestVolume dateRange={dateRange} />
      </FlexBox>
    </Card>
  )
}
