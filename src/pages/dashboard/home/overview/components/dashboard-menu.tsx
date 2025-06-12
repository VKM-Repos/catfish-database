import React from 'react'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { Heading } from 'src/components/ui/heading'
import { DropDownOption } from './drop-down-option'

export default function DashboardMenu() {
  const title = 'Farm Overview'

  return (
    <nav className="sticky left-0 top-[68px] z-50 flex h-fit w-full flex-col items-center justify-between bg-white px-10 py-4">
      <FlexBox className="w-full">
        <div className="flex w-full place-content-start items-center ">
          <Button
            size="lg"
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
          >
            <SolarIconSet.Home color="currentColor" size={20} iconStyle="Outline" />
            <Text size="sm" weight="light">
              All Clusters
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Bold" />
          </Button>
        </div>
        <div className="flex w-full place-content-end items-center gap-4">
          <Text size="sm" weight="light">
            All Time
          </Text>
          <Button
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
          >
            <Text size="sm" weight="light">
              May 21 - 27, 2024
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </Button>
        </div>
      </FlexBox>
      <FlexBox justify="between" align="center" className="sticky mb-[2rem] mt-4 w-full py-[.625rem]">
        <FlexBox direction="col" gap="gap-1">
          <Heading className="!text-[1.875rem] font-semibold">{title}</Heading>
          <Text className="text-sm text-neutral-700">View and manage your farm performance metrics</Text>
        </FlexBox>
        <div className="flex items-center gap-2">
          <DropDownOption />
          <Button>Submit Report</Button>
        </div>
      </FlexBox>
    </nav>
  )
}
