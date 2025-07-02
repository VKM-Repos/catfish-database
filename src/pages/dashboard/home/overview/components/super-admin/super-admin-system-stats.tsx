import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { formatNumberWithCommas } from 'src/lib/utils'
import StatsCard from '../stats-card'

export default function FarmOverviewStatistics() {
  const useGetUserStatusCount = createGetQueryHook({
    endpoint: '/dashboards/super-admin/user-status-count',
    responseSchema: z.any(),
    queryKey: ['user-status-count-super-admin-manager'],
  })
  const { data: userStatus } = useGetUserStatusCount()

  const useGetRegisteredPond = createGetQueryHook({
    endpoint: '/dashboards/super-admin/pond-count',
    responseSchema: z.any(),
    queryKey: ['pond-count-super-admin'],
  })
  const { data: registeredPonds } = useGetRegisteredPond()

  const useGetAvailableFish = createGetQueryHook({
    endpoint: '/dashboards/super-admin/fish-availability',
    responseSchema: z.any(),
    queryKey: ['available-stocked-fish-super-admin'],
  })
  const { data: availableStock } = useGetAvailableFish()

  const useGetRevenue = createGetQueryHook({
    endpoint: '/dashboards/super-admin/revenue/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['roi-overall-super-admin'],
  })
  const { data: totalRevenue } = useGetRevenue()

  const useGetMortality = createGetQueryHook({
    endpoint: '/dashboards/cluster/mortality-rate/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['mortality-cluster-manager'],
  })
  const { data: mortality } = useGetMortality()
  // 3. Check loading/error states

  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error fetching data</div>

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
        <StatsCard
          color={'#F8D082'}
          label={'Active farmers'}
          value={`${userStatus ? formatNumberWithCommas(userStatus?.activeUsers) : 0}`}
        />
        <StatsCard
          color={'#A0E8B9'}
          label={'Total registered ponds'}
          value={`${registeredPonds ? formatNumberWithCommas(registeredPonds?.totalPonds) : 0}`}
        />
        <StatsCard
          color={'#B9D9FF'}
          label={'Fish stocked'}
          value={`${availableStock ? formatNumberWithCommas(availableStock?.availableFish) : 0}`}
        />

        <StatsCard
          color={'#BCADFB'}
          label={'Total volume of sales'}
          value={`₦${totalRevenue ? formatNumberWithCommas(totalRevenue[0]?.totalRevenue) : 0}`}
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
