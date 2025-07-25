import React from 'react'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

export default function StatsCard({ color, label, value }: { color: string; label: string; value: any }) {
  return (
    <div style={{ backgroundColor: color }} className={`rounded-lg px-5 py-[1.875rem] shadow-md`}>
      <FlexBox gap="gap-[1.125rem]" direction="col">
        <Text className="text-xs text-[#37414F]">{label}</Text>
        <FlexBox direction="col" gap="gap-3">
          <Text className="!text-[1.5rem] font-bold text-[#1F2937]">{value}</Text>
          <div
            style={{
              backgroundColor: '#E7F6E5',
              color: '#0DA500',
            }}
            className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
          >
            {100}%
            <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" />
          </div>
        </FlexBox>
      </FlexBox>
    </div>
  )
}
