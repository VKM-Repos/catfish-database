import GaugeChart from 'react-gauge-chart'
import * as SolarIconSet from 'solar-icon-set'

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
    <div className="mb-4 flex min-h-full w-full flex-col gap-12 rounded-[.875rem] border border-[#8686871A] p-4 shadow-lg md:w-[45%]">
      <div className="flex items-center justify-between py-4">
        <p className="w-full text-sm font-semibold">Feed Conversion Ratio</p>
        <div className="flex w-full cursor-pointer items-center justify-end gap-2">
          <SolarIconSet.MenuDots size={24} iconStyle="Bold" />
        </div>
      </div>

      <div className="flex flex-col justify-between">
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
    </div>
  )
}
