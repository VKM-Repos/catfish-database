import React from 'react'
import { Card } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { HarvestVolumeOvertime } from './harvest-volume-overtime'
import { LineChartHarvestVolume } from './line-chart-harvest-volume'

export default function ProductAndHarvestMetrics() {
  return (
    <Card className="border border-neutral-200 p-[24px]">
      <FlexBox>
        <Card className="w-full p-[10px]">
          <FlexBox direction="col" gap="gap-1">
            <Text size="sm" weight="medium">
              Total harvest volume
            </Text>
            <Text size="lg" weight="semibold">
              32,000 kg
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
              ₦425/kg
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
              ₦89.5M
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
              0.89 kg
            </Text>
            <Text size="xs">Current</Text>
          </FlexBox>
        </Card>
      </FlexBox>
      <FlexBox>
        <HarvestVolumeOvertime />
        <LineChartHarvestVolume />
      </FlexBox>
    </Card>
  )
}
