import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import { useMemo, useState } from 'react'
import {
  averageWeightSchema,
  survivalRateSchema,
  totalFishSchema,
  totalRevenueSchema,
} from 'src/schemas/clusterFarmerSchema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { useAuthStore } from 'src/store/auth.store'
import { formatNumber } from 'src/lib/utils'

interface FarmStatisticsProps {
  farmerId: string
}

export default function FarmStatistics({ farmerId }: FarmStatisticsProps) {
  const { user } = useAuthStore()

  const useFetchClusterManFarmerPonds = createGetQueryHook({
    endpoint: `/ponds/clusters/me`,
    responseSchema: z.any(),
    queryKey: ['all-ponds'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })

  const args = { query: { farmerId: farmerId } }

  const { data: farmerPonds, isLoading: farmerPondsIsLoading } = useFetchClusterManFarmerPonds(args)

  console.log('farmerPonds overvie: ', farmerPonds)

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1), // Default to "All Time"
    to: new Date(),
  })

  const [selectedPond, setSelectedPond] = useState<string | null>(null)

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
  const useFeedConvRatio = createGetQueryHook({
    endpoint: '/dashboards/cluster/fcr/overall',
    responseSchema: z.any(),
    queryKey: ['fcr'],
  })
  const useGetSurvivalRate = createGetQueryHook({
    endpoint: '/dashboards/cluster/mortality-rate/overall?interval=ALL&farmerId=:id',
    responseSchema: survivalRateSchema,
    queryKey: ['survival-rate'],
  })

  const { data: totalFish, isLoading: totFisIsLoading } = useGetTotalFish({ route: { id: farmerId } })
  const { data: totalRevenue, isLoading: totRevIsLoading } = useGetRevenueTotal({ route: { id: farmerId } })
  const { data: averageWeight, isLoading: averWeigIsLoading } = useGetAverageWeight({ route: { id: farmerId } })
  const { data: fcrData, isLoading: fcrDataIsLoading } = useFeedConvRatio({
    query: {
      interval: 'MONTHLY',
      farmerId: farmerId,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const { data: survivalRate, isLoading: surRaIsLoading } = useGetSurvivalRate({ route: { id: farmerId } })

  // console.log("fcrData card: ",fcrData)
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
    // You can add additional logic here to refetch data with the new date range
    // For example, update query parameters or trigger data refresh
  }

  // Format number with commas and abbreviations (k, m, b)

  const farmStatCards = useMemo(() => {
    return [
      {
        color: '#F1A8D3',
        label: 'Total fish in farm',
        value: totFisIsLoading ? '...' : formatNumber(totalFish?.availableFish),
        rate: '+2.4%',
      },
      {
        color: '#BCADFB',
        label: 'Total revenue generated',
        value: totRevIsLoading ? '...' : `₦ ${formatNumber(totalRevenue?.[0]?.totalRevenue)}`,
        rate: '+0%',
      },
      {
        color: '#B9D9FF',
        label: 'Average weight',
        value: averWeigIsLoading
          ? '...'
          : `${averageWeight && averageWeight.length > 0 ? averageWeight[0]?.averageFishWeight.toFixed(2) : 0}g`,
        rate: '-2.4%',
      },
      {
        color: '#F8D082',
        label: 'Feed conversion ration',
        value: fcrDataIsLoading
          ? '...'
          : `${formatNumber(fcrData && fcrData.length > 0 ? fcrData[fcrData.length - 1].totalFeedConsumed : 0)}kg`,
        rate: '+2.4%',
      },
      {
        color: '#A0E8B9',
        label: 'Survival rate',
        value: surRaIsLoading ? '...' : `${survivalRate?.[0]?.survivalRate || 0}%`,
        // value: `${70}%`,
        rate: '+2.4%',
      },
    ]
  }, [totFisIsLoading, totRevIsLoading, averWeigIsLoading, surRaIsLoading, fcrDataIsLoading])

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="flex-1 text-xl font-semibold text-neutral-700">Farm Statistics</Text>
        <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="flex-1 " />
      </FlexBox>
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <div>
          <Select value={selectedPond || ''} onValueChange={(value) => setSelectedPond(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select pond" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={'ALL'} value={'ALL'}>
                All
              </SelectItem>
              {farmerPonds?.content?.map((pond: any) => (
                <SelectItem key={pond.id} value={pond.name}>
                  {pond.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
