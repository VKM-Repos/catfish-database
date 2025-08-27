import { ChartHeader } from 'src/components/global/chart-header'
import { Card } from 'src/components/ui/card'
import * as React from 'react'
// import GaugeChart from 'react-gauge-chart'
import { Interval, IntervalFilter } from 'src/components/ui/interval-filter'
import { DateRange } from 'src/components/ui/mega-datepicker'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Text } from 'src/components/ui/text'
import GaugeChartWrapper from 'src/components/ui/GaugeChartWrapper'

interface FeedConversionRatioProps {
  dateRange?: DateRange
  farmerId?: string
}

const useFCROverall = createGetQueryHook({
  endpoint: '/dashboards/cluster/fcr/overall',
  responseSchema: z.any(),
  queryKey: ['fcr-overall'],
})

export default function FeedConversionRatio({ dateRange, farmerId }: FeedConversionRatioProps) {
  const [interval, setInterval] = React.useState<Interval>('MONTHLY')
  // const value = 0.98

  const { data: fcrData, isLoading } = useFCROverall({
    query: {
      interval,
      farmerId: farmerId,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  // console.log("fcrData ratio: ",fcrData)

  // // Get the latest FCR value or average if multiple data points
  const latestFCR = fcrData?.length > 0 ? fcrData[fcrData.length - 1]?.fcrValue || 0 : 0
  const value = Math.min(latestFCR / 3, 1) // Normalize to 0-1 range for gauge display

  function roundToHalf(num: number): number {
    return Math.round(num * 2) / 2
  }

  function calculateRange(value: number) {
    const actualValue = latestFCR
    let min, mid, max
    if (actualValue <= 1) {
      min = 0.25
      mid = 0.5
      max = 1
    } else {
      min = roundToHalf(actualValue - 0.5)
      mid = roundToHalf(actualValue)
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

  const hasNoData = (fcrData?.length ?? 0) === 0

  return (
    <Card className="h-[30rem] w-full rounded-[.875rem] border border-neutral-200 p-4 md:w-[60%]">
      <ChartHeader
        title={'Feed conversion ratio'}
        action={
          <div className="flex gap-2">
            <IntervalFilter value={interval} onChange={setInterval} />
          </div>
        }
      />
      <div className="flex flex-col justify-between">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-400">Loading...</Text>
          </div>
        ) : hasNoData ? (
          <div className="flex h-full items-center justify-center">
            <Text className="text-sm text-neutral-500">No data available for this filter</Text>
          </div>
        ) : (
          <>
            <GaugeChartWrapper
              className="min-h-fit"
              nrOfLevels={420}
              arcsLength={[1.5, 2.0, 1.5]}
              colors={['#FAC898', '#FF5F15', '#CC5500']}
              percent={value}
              arcPadding={0.01}
              formatTextValue={() => latestFCR.toFixed(2)}
              textColor="#000"
            />
            <p className="mx-auto flex w-full max-w-[70%] items-center justify-between">
              {Object.entries(range).map(([key, val]) => (
                <span key={key}>{val.toFixed(1)}</span>
              ))}
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
