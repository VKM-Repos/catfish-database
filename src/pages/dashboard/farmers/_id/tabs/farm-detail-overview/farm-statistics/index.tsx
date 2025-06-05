import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'

export default function FarmStatistics() {
  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="w-full text-xl font-semibold text-neutral-700">Farm Statistics</Text>
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
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
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
      </FlexBox>

      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-5">
        {farmStatCards.map((farmStat, index) => {
          const sign = isPositive(farmStat.rate)

          return (
            <div key={index} style={{ backgroundColor: farmStat.color }} className={`rounded-lg px-5 py-[1.875rem]`}>
              <FlexBox gap="gap-[1.125rem]" direction="col">
                <Text className="text-xs text-[#37414F]">{farmStat.label}</Text>
                <FlexBox direction="col" gap="gap-3">
                  <Text className="!text-[1.5rem] font-bold text-[#1F2937]">{farmStat.value}</Text>
                  <div
                    style={{
                      backgroundColor: sign === true ? '#E7F6E5' : '#FFE5E5',
                      color: sign === true ? '#0DA500' : '#FF0000',
                    }}
                    className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
                  >
                    {farmStat.rate}
                    {sign === true ? (
                      <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" />
                    ) : (
                      <SolarIconSet.ArrowToDownLeft size={16} iconStyle="Broken" color="currentColor" />
                    )}
                  </div>
                </FlexBox>
              </FlexBox>
            </div>
          )
        })}
      </Grid>
    </FlexBox>
  )
}

const farmStatCards = [
  {
    color: '#F1A8D3',
    label: 'Total fish in farm',
    value: '2,000',
    rate: '+2.4%',
  },
  {
    color: '#BCADFB',
    label: 'Total revenue generated',
    value: '2M',
    rate: '+2.4%',
  },
  {
    color: '#B9D9FF',
    label: 'Average weight',
    value: '320g',
    rate: '-2.4%',
  },
  {
    color: '#F8D082',
    label: 'Feed conversion ration',
    value: '620kg',
    rate: '+2.4%',
  },
  {
    color: '#A0E8B9',
    label: 'Survival rate',
    value: '76%',
    rate: '+2.4%',
  },
]

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
