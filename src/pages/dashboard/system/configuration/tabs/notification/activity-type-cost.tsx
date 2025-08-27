import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Grid } from 'src/components/ui/grid'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { MaintenanceActivityTypes } from 'src/lib/constants'
import { formatLabel, formatPrice } from 'src/lib/utils'
import { z } from 'zod'

const useGetTotalMaintenanceCostByType = createGetQueryHook({
  endpoint: '/dashboards/farmer/maintenance-cost/by-type',
  responseSchema: z.any(),
  queryKey: ['total-maintenance-cost-type'],
})

export default function ActivityTypeCost() {
  const { data: activityTypeCosts = [] } = useGetTotalMaintenanceCostByType()

  // Map backend data for quick lookup
  const costMap = Object.fromEntries((activityTypeCosts || []).map((item: any) => [item.type, item.totalCost]))

  return (
    <Card className="min-h-[25rem] w-full rounded-[.875rem] border border-neutral-200 p-8">
      <ChartHeader title={'Activity Type Costs'} action={null} />
      <Grid cols={1} gap="gap-6" className="mt-6 w-full !grid-cols-1 text-sm">
        {Object.values(MaintenanceActivityTypes).map((type) => (
          <FlexBox key={type} gap="gap-2" direction="row" justify="between">
            <Text variant="body" color="text-neutral-500" weight="normal">
              {formatLabel(type)}
            </Text>
            <Text variant="body" color="text-neutral-500" weight="semibold">
              {costMap[type] !== undefined && costMap[type] !== null ? formatPrice(costMap[type]) : '-'}
            </Text>
          </FlexBox>
        ))}
      </Grid>
    </Card>
  )
}
