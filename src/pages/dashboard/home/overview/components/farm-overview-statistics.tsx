import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

// 1. Define API endpoints and schemas for each card
type CardTypes = {
  endpoint: string
  queryKey: [string]
}
const cardConfigs: CardTypes[] = [
  {
    endpoint: '/dashboard/farmer/revenue/overall?interval=MONTHLY',
    queryKey: ['revenue'],
    // responseSchema: revenueSchema, // Add if needed
  },
  {
    endpoint: '/dashboard/farmer/production-cost/overall?interval=MONTHLY',
    queryKey: ['running-cost'],
  },
  {
    endpoint: '/dashboard/farmer/gross-profit/overall?interval=MONTHLY',
    queryKey: ['gross-profit'],
  },
  {
    endpoint: '/dashboard/farmer/roi/overall?interval=MONTHLY',
    queryKey: ['roi'],
  },
]

export default function FarmOverviewStatistics() {
  // 2. Fetch data for each card in parallel
  const queries = cardConfigs.map((config) =>
    createGetQueryHook({
      endpoint: config.endpoint,
      queryKey: config.queryKey,
      responseSchema: z.any(),
    })(),
  )

  // 3. Check loading/error states
  const isLoading = queries.some((query) => query.isLoading)
  const isError = queries.some((query) => query.isError)

  // 4. Merge API data with default card props
  const pondStats = pondStatCards.map((card, index) => ({
    ...card,
    value: queries[index]?.data?.value || '₦0', // Fallback if no data
    rate: queries[index]?.data?.rate || '0%', // Fallback if no data
  }))

  if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error fetching data</div>

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
        {pondStats.map((pondStat, index) => {
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
                      backgroundColor: sign ? '#E7F6E5' : '#FFE5E5',
                      color: sign ? '#0DA500' : '#FF0000',
                    }}
                    className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
                  >
                    {pondStat.rate}
                    {sign ? (
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

// Default card data (fallback if API fails)
const pondStatCards = [
  {
    color: '#F8D082',
    label: 'Total revenue generated',
    value: '₦0', // Placeholder
    rate: '0%', // Placeholder
  },
  {
    color: '#A0E8B9',
    label: 'Total running cost',
    value: '₦0',
    rate: '0%',
  },
  {
    color: '#B9D9FF',
    label: 'Gross profit',
    value: '₦0',
    rate: '0%',
  },
  {
    color: '#F1A8D3',
    label: 'ROI',
    value: '0%',
    rate: '0%',
  },
]

// Helper function (unchanged)
export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
