import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { formatPrice } from 'src/lib/utils'
import { useMemo } from 'react'

// Schema for feed total response
const feedTotalSchema = z.object({
  totalQuantity: z.number(),
  totalCost: z.number(),
  intervalLabel: z.string(),
})

// Schema for total weight per pond response
const totalWeightPerPondSchema = z.array(
  z.object({
    pondId: z.string(),
    pondName: z.string(),
    weights: z.array(
      z.object({
        interval: z.string(),
        totalWeight: z.number(),
      }),
    ),
  }),
)

// Schema for production cost per pond response
const productionCostPerPondSchema = z.array(
  z.object({
    pondId: z.string(),
    pondName: z.string(),
    costs: z.array(
      z.object({
        intervalLabel: z.string(),
        totalCost: z.number(),
      }),
    ),
  }),
)

// Schema for average mortality rate response
const averageMortalityRateSchema = z.object({
  intervalLabel: z.string(),
  mortalityRate: z.number(),
  survivalRate: z.number(),
})

interface PondStatisticsProps {
  pondId: string
}

export default function PondStatistics({ pondId }: PondStatisticsProps) {
  // Hook to fetch feed total data
  const useGetFeedTotal = createGetQueryHook({
    endpoint: '/dashboards/farmer/fcr/per-pond',
    responseSchema: z.any(),
    queryKey: ['feed-total'],
  })

  // Hook to fetch previous week's feed data for comparison
  const useGetTotalCostFeedTotal = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed-consumption/per-pond',
    responseSchema: z.any(),
    queryKey: ['total-cost-feed'],
  })

  // Hook to fetch total weight per pond
  const useGetTotalWeightPerPond = createGetQueryHook({
    endpoint: '/dashboards/farmer/volume-of-sales/per-pond',
    responseSchema: z.any(),
    queryKey: ['total-weight-per-pond'],
  })

  // Hook to fetch average mortality rate (for survival rate)
  const useGetMortalityRate = createGetQueryHook({
    endpoint: '/dashboards/farmer/mortality-rate/per-pond',
    responseSchema: z.any(),
    queryKey: ['mortality-rate'],
  })

  const { data: feedTotal, isLoading: feedTotalLoading } = useGetFeedTotal({
    query: {
      interval: 'ALL',
      pondId: pondId,
      // startDate: dateRange?.from?.toISOString().split('T')[0],
      // endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const { data: totalCostFeed, isLoading: totalCostFeedLoading } = useGetTotalCostFeedTotal({
    query: {
      interval: 'ALL',
      pondId: pondId,
      // startDate: dateRange?.from?.toISOString().split('T')[0],
      // endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  const { data: totalWeightData, isLoading: totalWeightLoading } = useGetTotalWeightPerPond({
    query: {
      interval: 'ALL',
      pondId: pondId,
      // startDate: dateRange?.from?.toISOString().split('T')[0],
      // endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const { data: mortalityRateData, isLoading: mortalityRateLoading } = useGetMortalityRate({
    query: {
      interval: 'ALL',
      pondId: pondId,
      // startDate: dateRange?.from?.toISOString().split('T')[0],
      // endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const isLoading = feedTotalLoading || totalCostFeedLoading || totalWeightLoading || mortalityRateLoading

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return '+0.0%'
    const change = ((current - previous) / previous) * 100
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  // Create pond stat cards with real data
  const pondStatCards = useMemo(() => {
    return [
      {
        color: '#F1A8D3',
        label: 'Total feed consumed',
        value: feedTotalLoading ? '...' : `${feedTotal?.fcrValues?.[0]?.totalFeedConsumed ?? 0}kg`,
        rate: '+0.0%',
      },
      {
        color: '#B9D9FF',
        label: 'Total cost of feed',
        value: totalCostFeedLoading
          ? '...'
          : formatPrice(totalCostFeed?.consumptionByInterval?.[0]?.totalCost) ?? '₦ 0.00',
        rate: '+0.0%',
      },
      {
        color: '#F8D082',
        label: 'Total weight of fish',
        value: totalWeightLoading
          ? '...'
          : totalWeightData && totalWeightData?.sales > 0
          ? `${totalWeightData?.sales?.[0]?.totalWeight?.toLocaleString()}`
          : '0',
        rate: '+0.0%',
      },
      {
        color: '#A0E8B9',
        label: 'Survival Rate',
        value: mortalityRateLoading ? '...' : `${mortalityRateData?.rates?.[0]?.survivalRate?.toFixed(1) ?? '0'}%`,
        rate: '+0.0%',
      },
    ]
  }, [
    feedTotalLoading,
    feedTotal,
    totalCostFeedLoading,
    totalCostFeed,
    totalWeightLoading,
    totalWeightData,
    mortalityRateLoading,
    mortalityRateData,
  ])

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full grid-cols-2 text-sm lg:grid-cols-4">
        {pondStatCards?.map((pondStat, index) => {
          const sign = isPositive(pondStat?.rate)

          return (
            <div key={index} style={{ backgroundColor: pondStat.color }} className={`rounded-lg px-5 py-[1.875rem]`}>
              <FlexBox gap="gap-[1.125rem]" direction="col">
                <Text className="text-xs text-[#37414F]">{pondStat?.label}</Text>
                <FlexBox direction="col" gap="gap-3">
                  <Text className="!text-[1.5rem] font-bold text-[#1F2937]">{pondStat?.value}</Text>
                  <div
                    style={{
                      backgroundColor: sign === true ? '#E7F6E5' : '#FFE5E5',
                      color: sign === true ? '#0DA500' : '#FF0000',
                    }}
                    className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
                  >
                    {pondStat?.rate}
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
  const numericValue = parseFloat(value?.replace('%', '').trim())
  return numericValue >= 0
}
