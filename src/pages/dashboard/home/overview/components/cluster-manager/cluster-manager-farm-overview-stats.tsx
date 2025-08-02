import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import StatsCard from './stats-card'
import { formatNumber } from 'src/lib/utils'
type DateRange = { from: Date; to: Date }
interface FarmOverviewStatisticsProps {
  dateRange?: DateRange
}
export default function FarmOverviewStatistics({ dateRange }: FarmOverviewStatisticsProps) {
  const useGetUserStatusCount = createGetQueryHook({
    endpoint: '/dashboards/super-admin/user-status-count',
    responseSchema: z.any(),
    queryKey: ['user-status-count-cluster-manager'],
  })
  const { data: userStatus } = useGetUserStatusCount({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetRegisteredPond = createGetQueryHook({
    endpoint: '/dashboards/cluster/pond-count',
    responseSchema: z.any(),
    queryKey: ['production-cost-overall'],
  })
  const { data: registeredPonds } = useGetRegisteredPond({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetAvailableFish = createGetQueryHook({
    endpoint: '/dashboards/cluster/fish-availability',
    responseSchema: z.any(),
    queryKey: ['available-stocked-fish-cluster-manager'],
  })
  const { data: availableStock } = useGetAvailableFish({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetRevenue = createGetQueryHook({
    endpoint: '/dashboards/cluster/revenue/overall',
    responseSchema: z.any(),
    queryKey: ['roi-overall-cluster-manager'],
  })
  const { data: totalRevenue } = useGetRevenue({
    query: {
      interval: 'ALL',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const useGetMortality = createGetQueryHook({
    endpoint: '/dashboards/cluster/mortality-rate/overall',
    responseSchema: z.any(),
    queryKey: ['mortality-cluster-manager'],
  })
  const { data: mortality } = useGetMortality({
    query: {
      interval: 'ALL',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  // 3. Check loading/error states

  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error fetching data</div>

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full grid-cols-2 text-sm lg:grid-cols-5">
        <StatsCard
          color={'#F8D082'}
          label={'Active farmers'}
          value={`${userStatus ? formatNumber(userStatus?.activeUsers) : 0}`}
        />
        <StatsCard
          color={'#A0E8B9'}
          label={'Total registered ponds'}
          value={`${registeredPonds ? formatNumber(registeredPonds?.totalPonds) : 0}`}
        />
        <StatsCard
          color={'#B9D9FF'}
          label={'Fish stocked'}
          value={`${availableStock ? formatNumber(availableStock?.availableFish) : 0}`}
        />
        <StatsCard
          color={'#F1A8D3'}
          label={'Avg mortality rate'}
          value={`${mortality ? mortality[0]?.mortalityRate : 0}%`}
        />
        <StatsCard
          color={'#BCADFB'}
          label={'Total volume of sales'}
          value={`₦${totalRevenue ? formatNumber(totalRevenue[0]?.totalRevenue) : 0}`}
          className="col-span-2 lg:col-span-1"
          // value={`₦${totalRevenue ? formatNumberWithCommas(totalRevenue[0]?.totalRevenue) : 0}`}
        />
      </Grid>
    </FlexBox>
  )
}

// Default card data (fallback if API fails)
const pondStatCards = [
  {
    color: '#F8D082',
    label: 'Active farmers',
    value: '0', // Placeholder
    rate: '0%', // Placeholder
  },
  {
    color: '#A0E8B9',
    label: 'Total registered ponds',
    value: '0',
    rate: '0%',
  },
  {
    color: '#B9D9FF',
    label: 'Fish stocked',
    value: '₦0',
    rate: '0%',
  },
  {
    color: '#F1A8D3',
    label: 'Avg mortality rate',
    value: '0%',
    rate: '0%',
  },
  {
    color: '#BCADFB',
    label: 'Total volume of sales',
    value: '₦89.5M',
    rate: '0%',
  },
]

// Helper function (unchanged)
export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
