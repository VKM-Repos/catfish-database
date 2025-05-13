import { ChartHeader } from 'src/components/global/chart-header'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import * as SolarIconSet from 'solar-icon-set'
import * as React from 'react'
import GaugeChart from 'react-gauge-chart'

export default function FeedConversionRatio() {
  const value = 0.98

  function roundToHalf(num: number): number {
    return Math.round(num * 2) / 2
  }

  function calculateRange(value: number) {
    let min, mid, max
    if (value <= 1) {
      min = 0.25
      mid = 0.5
      max = 1
    } else {
      min = roundToHalf(value - 0.5)
      mid = roundToHalf(value)
      max = roundToHalf(mid + 0.5)
    }

    if (min === mid) {
      mid = roundToHalf(mid + 0.5)
    }

    if (mid === max) {
      max = roundToHalf(max + 0.5)
    }

    return { min, mid, max }
  }

  const range = calculateRange(value)

  return (
    <Card className="h-[30rem] w-full rounded-[.875rem] border border-neutral-200 p-4 md:w-[60%]">
      <ChartHeader
        title={'Feed conversion ratio'}
        action={
          <Button variant="ghost" className="rotate-90">
            <SolarIconSet.MenuDots color="#A1A4AA" size={28} iconStyle="Bold" />
          </Button>
        }
      />
      <div className="flex flex-col justify-between">
        ≈
        <GaugeChart
          className="min-h-fit"
          nrOfLevels={420}
          arcsLength={[1.5, 2.0, 1.5]}
          colors={['#FAC898', '#FF5F15', '#CC5500']}
          percent={value}
          arcPadding={0.01}
          formatTextValue={(value: string) => (Number(value) / 100).toString()}
          textColor="#000"
        />
        <p className="mx-auto flex w-full max-w-[70%] items-center justify-between">
          {Object.entries(range).map(([key, val]) => (
            <span key={key}>{val.toFixed(1)}</span>
          ))}
        </p>
      </div>
    </Card>
  )
}
