import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Grid } from 'src/components/ui/grid'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { formatPrice } from 'src/lib/utils'
import { z } from 'zod'

const useGetTotalMaintenanceCostByPond = createGetQueryHook({
  endpoint: '/dashboards/farmer/production-cost/per-pond?interval=ALL',
  responseSchema: z.any(),
  queryKey: ['total-maintenance-cost-pond'],
})

export default function PondCost() {
  const { data: pondCosts = [] } = useGetTotalMaintenanceCostByPond()

  return (
    <Card className="min-h-[25rem] w-full rounded-[.875rem] border border-neutral-200 p-8">
      <ChartHeader title={'Cost by pond'} action={null} />
      <Grid cols={1} gap="gap-6" className="mt-6 w-full !grid-cols-1 text-sm">
        {pondCosts.length === 0 ? (
          <Text variant="body" color="text-neutral-500">
            No data
          </Text>
        ) : (
          pondCosts.map((pond: any) => (
            <FlexBox key={pond.pondId} gap="gap-2" direction="row" justify="between">
              <Text variant="body" color="text-neutral-500" weight="semibold">
                {pond.pondName}
              </Text>
              <Text variant="body" color="text-neutral-500" weight="light">
                {pond.costs?.[0]?.totalCost ? formatPrice(pond.costs[0].totalCost) : '-'}
              </Text>
            </FlexBox>
          ))
        )}
      </Grid>
    </Card>
  )
}
