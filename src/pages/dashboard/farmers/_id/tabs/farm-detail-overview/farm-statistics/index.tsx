import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import { useMemo, useState } from 'react'

const totalFishSchema = z.object({
  availableFish: z.number(),
  soldFish: z.number(),
})

const totalRevenueSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    totalRevenue: z.number(),
  }),
)

const averageWeightSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    totalWeight: z.number(),
    totalRevenue: z.number(),
    totalQuantity: z.number(),
    averageSellingPrice: z.number(),
    averageFishWeight: z.number(),
  }),
)

const survivalRateSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    mortalityRate: z.number(),
    survivalRate: z.number(),
  }),
)

interface FarmStatisticsProps {
  farmerId: string
}

export default function FarmStatistics({ farmerId }: FarmStatisticsProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1), // Default to "All Time"
    to: new Date(),
  })

  const useGetTotalFish = createGetQueryHook({
    endpoint: '/dashboards/cluster/fish-availability?farmerId=:id',
    responseSchema: totalFishSchema,
    queryKey: ['total-fish'],
  })
  const useGetRevenueTotal = createGetQueryHook({
    endpoint: '/dashboards/cluster/revenue/overall?interval=ALL&farmerId=:id',
    responseSchema: totalRevenueSchema,
    queryKey: ['total-revenue'],
  })

  const useGetAverageWeight = createGetQueryHook({
    endpoint: '/dashboards/cluster/volume-of-sales?interval=YEARLY&farmerId=:id',
    responseSchema: averageWeightSchema,
    queryKey: ['average-weight'],
  })
  // const useGetFeedTotal = createGetQueryHook({
  //   endpoint: '/dashboards/farmer/feed/total?interval=ALL',
  //   responseSchema: feedTotalSchema,
  //   queryKey: ['feed-total'],
  // })
  const useGetSurvivalRate = createGetQueryHook({
    endpoint: '/dashboards/cluster/mortality-rate/overall?interval=ALL&farmerId=:id',
    responseSchema: survivalRateSchema,
    queryKey: ['survival-rate'],
  })

  const { data: totalFish, isLoading: totFisIsLoading } = useGetTotalFish({ route: { id: farmerId } })
  const { data: totalRevenue, isLoading: totRevIsLoading } = useGetRevenueTotal({ route: { id: farmerId } })
  const { data: averageWeight, isLoading: averWeigIsLoading } = useGetAverageWeight({ route: { id: farmerId } })
  const { data: survivalRate, isLoading: surRaIsLoading } = useGetSurvivalRate({ route: { id: farmerId } })

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
    // You can add additional logic here to refetch data with the new date range
    // For example, update query parameters or trigger data refresh
  }
  console.log('totalFish: ', totalFish?.availableFish)
  console.log('totalRevenue: ', totalRevenue?.[0]?.totalRevenue)
  console.log('averageWeight: ', averageWeight)
  console.log('survivalRate: ', survivalRate?.[0]?.survivalRate)

  const farmStatCards = useMemo(() => {
    return [
      {
        color: '#F1A8D3',
        label: 'Total fish in farm',
        value: `${totalFish?.availableFish}`,
        rate: '+2.4%',
      },
      {
        color: '#BCADFB',
        label: 'Total revenue generated',
        value: `N ${totalRevenue?.[0]?.totalRevenue}`,
        rate: '+0%',
      },
      {
        color: '#B9D9FF',
        label: 'Average weight',
        value: `${averageWeight && averageWeight.length > 0 ? averageWeight[0]?.averageFishWeight : 0}g`,
        rate: '-2.4%',
      },
      {
        color: '#F8D082',
        label: 'Feed conversion ration',
        // value: `${(averageWeight && averageWeight.length > 0 ? averageWeight[0]?.averageFishWeight : 0)}kg`,
        value: `354kg`,
        rate: '+2.4%',
      },
      {
        color: '#A0E8B9',
        label: 'Survival rate',
        value: `${survivalRate?.[0]?.survivalRate}%`,
        // value: `${70}%`,
        rate: '+2.4%',
      },
    ]
  }, [])

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="w-full text-xl font-semibold text-neutral-700">Farm Statistics</Text>
        <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="w-auto" />
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

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
