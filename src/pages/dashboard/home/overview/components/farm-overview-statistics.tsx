import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import StatsCard from './stats-card'
import { formatNumberWithCommas } from 'src/lib/utils'

export default function FarmOverviewStatistics() {
  const useGetRevenueOverall = createGetQueryHook({
    endpoint: '/dashboards/farmer/revenue/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['revenue-overall'],
  })
  const { data: revenueOverall } = useGetRevenueOverall()

  const useGetProductionCost = createGetQueryHook({
    endpoint: '/dashboards/farmer/production-cost/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['production-cost-overall'],
  })
  const { data: productionCost } = useGetProductionCost()

  const useGetGrossProfit = createGetQueryHook({
    endpoint: '/dashboards/farmer/gross-profit/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['gross-profit-overall'],
  })
  const { data: grossProfits } = useGetGrossProfit()

  const useGetRoi = createGetQueryHook({
    endpoint: '/dashboards/farmer/roi/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['roi-overall'],
  })
  const { data: roiOverall } = useGetRoi()
  // 3. Check loading/error states

  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error fetching data</div>

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
        <StatsCard
          color={'#F8D082'}
          label={'Total revenue generated'}
          value={`₦${revenueOverall ? formatNumberWithCommas(revenueOverall[0]?.totalRevenue) : 0}`}
        />
        <StatsCard
          color={'#A0E8B9'}
          label={'Total running cost'}
          value={`₦${productionCost ? formatNumberWithCommas(productionCost[0]?.totalCost) : 0}`}
        />
        <StatsCard
          color={'#B9D9FF'}
          label={'Gross profit'}
          value={`₦${grossProfits ? formatNumberWithCommas(grossProfits[0]?.grossProfit) : 0}`}
        />
        <StatsCard color={'#F1A8D3'} label={'ROI'} value={`${roiOverall ? roiOverall[0]?.roi : 0}%`} />
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
