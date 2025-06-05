import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'

export default function FarmOverviewStatistics() {
  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
        {pondStatCards.map((pondStat, index) => {
          const sign = isPositive(pondStat.rate)

          return (
            <div
              key={index}
              style={{ backgroundColor: pondStat.color }}
              className={`rounded-lg px-5 py-[1.875rem] shadow-md`}
            >
              <FlexBox gap="gap-[1.125rem]" direction="col">
                <Text className="text-xs text-[#37414F]">{pondStat.label}</Text>
                <FlexBox direction="col" gap="gap-3">
                  <Text className="!text-[1.5rem] font-bold text-[#1F2937]">{pondStat.value}</Text>
                  <div
                    style={{
                      backgroundColor: sign === true ? '#E7F6E5' : '#FFE5E5',
                      color: sign === true ? '#0DA500' : '#FF0000',
                    }}
                    className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
                  >
                    {pondStat.rate}
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

const pondStatCards = [
  {
    color: '#F8D082',
    label: 'Total revenue generated',
    value: '₦85,750',
    rate: '+2.4%',
  },
  {
    color: '#A0E8B9',
    label: 'Total running cost',
    value: '₦32,000',
    rate: '-2.4%',
  },
  {
    color: '#B9D9FF',
    label: 'Gross profit',
    value: '₦29,520',
    rate: '+2.4%',
  },
  {
    color: '#F1A8D3',
    label: 'ROI',
    value: '52.5%',
    rate: '+2.4%',
  },
]

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
