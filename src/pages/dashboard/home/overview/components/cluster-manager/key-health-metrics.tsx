import React from 'react'
import { Card } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

export default function KeyHealthMetrics() {
  return (
    <Card className="h-fit w-full border border-neutral-200 px-[20px] py-[10px]">
      <Text className="mb-[5px] mt-[30px] text-[14px] font-medium">Key Health Metrics</Text>
      <FlexBox className="mt-[20px] w-full" direction="col">
        {[1, 2, 3].map((_, index) => (
          <FlexBox
            key={index}
            className="w-full rounded-[8px] bg-neutral-100 p-[10px]"
            direction="row"
            align="center"
            justify="between"
          >
            <FlexBox gap="gap-[4px]" direction="col" justify="between">
              <Text className="text-[14px] font-medium">Average FCR</Text>
              <Text className="text-[12px] font-normal">Target: {'<2.0'}</Text>
            </FlexBox>
            <FlexBox direction="row" align="center">
              <Text className="text-[16px] font-semibold">1.85</Text>
              <div
                style={{
                  backgroundColor: '#E7F6E5',
                  color: '#0DA500',
                }}
                className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
              >
                +15%
                <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" />
                {/* <SolarIconSet.ArrowToDownLeft size={16} iconStyle="Broken" color="currentColor" /> */}
              </div>
            </FlexBox>
          </FlexBox>
        ))}
      </FlexBox>
    </Card>
  )
}
