import React from 'react'
import { Card } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

export default function ClusterHealthAlert() {
  return (
    <Card className="h-fit w-full border border-neutral-200 px-[20px] py-[10px]">
      <FlexBox className=" w-full" direction="col">
        <Text className="mb-[5px] mt-[30px] text-[14px] font-medium">Active Alerts</Text>
        <FlexBox className="w-full" direction="col" gap="gap-[16px]">
          {[1, 2, 3].map((_, index) => (
            <FlexBox key={index} className="w-full rounded-[8px] border-l-4 border-l-[#FF9040] bg-[#FFF0E5] p-[10px]">
              <SolarIconSet.DangerTriangle />
              <FlexBox direction="col" gap="gap-0">
                <Text className="text-[12px] font-medium">
                  15% of farmers haven&lsquo;t submitted feeding records this week
                </Text>
                <Text className="text-[12px] font-normal">Follow up required</Text>
              </FlexBox>
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
