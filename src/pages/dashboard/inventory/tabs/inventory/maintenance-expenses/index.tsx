import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
// import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import MaintenanceStatistics from './maintenance-stats'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Section } from 'src/components/ui/section'
import ActivityTypeCost from './activity-type-cost'
import PondCost from './pond-cost'
import { Container } from 'src/components/ui/container'

export default function MaintenanceExpenses() {
  const navigate = useNavigate()
  const useGetManitenanceCost = createGetQueryHook({
    endpoint: `/maintenance-costs?&direction=DESC`,
    responseSchema: z.any(),
    queryKey: ['maintenance-costs'],
  })

  const useGetTotalMaintenanceCost = createGetQueryHook({
    endpoint: '/dashboards/farmer/maintenance/total?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['total-maintenance-cost'],
  })

  const { data: maintenanceCost, isLoading } = useGetManitenanceCost()
  const { data: totalMaintenanceCost } = useGetTotalMaintenanceCost()

  console.log('Maintenance Cost Data:', maintenanceCost)

  const title = 'Expenses'
  const actions = (
    <Inline>
      <Button
        variant="primary"
        className="flex items-center gap-2"
        onClick={() => navigate(paths.dashboard.inventory.createMaintenanceRecord())}
      >
        <SolarIconSet.AddCircle size={20} />
        <Text>Add record</Text>
      </Button>
    </Inline>
  )

  return (
    <Container>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <MaintenanceStatistics totalMaintenanceCost={totalMaintenanceCost?.totalCost} />
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          <div>{actions}</div>
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={maintenanceCost?.content ?? []}
          isLoading={isLoading}
          emptyStateMessage="No feed inventory found"
        />
      </FlexBox>
      <Section className="mt-6 flex items-start justify-between gap-10">
        <ActivityTypeCost />
        <PondCost />
      </Section>
    </Container>
  )
}
