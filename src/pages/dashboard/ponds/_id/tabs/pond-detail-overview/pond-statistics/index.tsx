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
    endpoint: '/dashboards/farmer/feed/total?interval=ALL',
    responseSchema: feedTotalSchema,
    queryKey: ['feed-total'],
  })

  // Hook to fetch previous week's feed data for comparison
  const useGetPreviousFeedTotal = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed/total?interval=ALL',
    responseSchema: feedTotalSchema,
    queryKey: ['feed-total-previous'],
  })

  // Hook to fetch total weight per pond
  const useGetTotalWeightPerPond = createGetQueryHook({
    endpoint: '/dashboards/farmer/total-weight/per-pond?interval=ALL',
    responseSchema: totalWeightPerPondSchema,
    queryKey: ['total-weight-per-pond'],
  })

  // Hook to fetch production cost per pond
  const useGetProductionCostPerPond = createGetQueryHook({
    endpoint: '/dashboards/farmer/production-cost/per-pond?interval=ALL',
    responseSchema: productionCostPerPondSchema,
    queryKey: ['production-cost-per-pond'],
  })

  // Hook to fetch average mortality rate (for survival rate)
  const useGetAverageMortalityRate = createGetQueryHook({
    endpoint: '/dashboards/farmer/average-mortality-rate',
    responseSchema: averageMortalityRateSchema,
    queryKey: ['average-mortality-rate'],
  })

  const { data: feedTotal, isLoading: feedTotalLoading } = useGetFeedTotal()
  const { data: previousFeedTotal, isLoading: previousFeedTotalLoading } = useGetPreviousFeedTotal()
  const { data: totalWeightData, isLoading: totalWeightLoading } = useGetTotalWeightPerPond()
  const { data: productionCostData, isLoading: productionCostLoading } = useGetProductionCostPerPond()
  const { data: mortalityRateData, isLoading: mortalityRateLoading } = useGetAverageMortalityRate()

  const isLoading =
    feedTotalLoading || previousFeedTotalLoading || totalWeightLoading || productionCostLoading || mortalityRateLoading

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return '+0.0%'
    const change = ((current - previous) / previous) * 100
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  // Extract pond-specific data
  const pondData = useMemo(() => {
    // Find current pond's weight data
    const currentPondWeight = totalWeightData?.find((pond) => pond?.pondId === pondId)
    const currentWeight = currentPondWeight?.weights[0]?.totalWeight || 0

    // Find current pond's production cost data
    const currentPondCost = productionCostData?.find((pond) => pond?.pondId === pondId)
    const currentCost = currentPondCost?.costs[0]?.totalCost || 0

    return {
      currentWeight,
      currentCost,
    }
  }, [totalWeightData, productionCostData, pondId])

  // Create pond stat cards with real data
  const pondStatCards = useMemo(() => {
    // if (!feedTotal || !mortalityRateData) return []

    return [
      {
        color: '#F1A8D3',
        label: 'Total feed consumed',
        value: `${feedTotal?.totalQuantity.toLocaleString()}kg`,
        rate: previousFeedTotal
          ? calculatePercentageChange(feedTotal?.totalQuantity ?? 0, previousFeedTotal?.totalQuantity ?? 0)
          : '+0.0%',
      },
      {
        color: '#B9D9FF',
        label: 'Total cost of feed',
        value: formatPrice(feedTotal?.totalCost),
        rate: previousFeedTotal
          ? calculatePercentageChange(feedTotal?.totalCost ?? 0, previousFeedTotal?.totalCost ?? 0)
          : '+0.0%',
      },
      {
        color: '#F8D082',
        label: 'Total weight of fish',
        value: `${pondData?.currentWeight?.toLocaleString() ?? '-'}`,
        rate: '+0.0%', // No previous data available for comparison
      },
      {
        color: '#A0E8B9',
        label: 'Survival Rate',
        value: `${mortalityRateData?.survivalRate?.toFixed(1) ?? '0'}% `,
        rate: '+0.0%', // No previous data available for comparison
      },
    ]
  }, [feedTotal, previousFeedTotal, pondData, mortalityRateData])

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
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
