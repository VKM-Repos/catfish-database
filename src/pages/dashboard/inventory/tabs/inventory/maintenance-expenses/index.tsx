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

// --- Mock data for maintenance expenses ---
const mockMaintenanceExpenses = [
  {
    id: '1',
    updatedAt: '2025-05-30T10:00:00Z',
    type: 'Cleaning',
    description: 'General pond cleaning and debris removal',
    cost: 2000,
    pond: 'Pond A',
  },
  {
    id: '2',
    updatedAt: '2025-05-29T15:30:00Z',
    type: 'Repairs',
    description: 'Fixed broken inlet pipe',
    cost: 5500,
    pond: 'Pond B',
  },
  {
    id: '3',
    updatedAt: '2025-05-28T09:15:00Z',
    type: 'Disinfection',
    description: 'Applied disinfectant to all surfaces',
    cost: 3200,
    pond: 'Pond C',
  },
  {
    id: '4',
    updatedAt: '2025-05-27T12:45:00Z',
    type: 'Others',
    description: 'Miscellaneous maintenance',
    cost: 1000,
    pond: 'Pond D',
  },
]

export default function MaintenanceExpenses() {
  const navigate = useNavigate()
  const useGetManitenanceCost = createGetQueryHook({
    endpoint: `/maintenance-costs?&direction=DESC`,
    responseSchema: z.any(),
    queryKey: ['maintenance-costs'],
  })

  const { data: maintenanceCost, isLoading } = useGetManitenanceCost()

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
    <>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <MaintenanceStatistics />
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          <div>{actions}</div>
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={mockMaintenanceExpenses}
          isLoading={isLoading}
          emptyStateMessage="No feed inventory found"
        />
      </FlexBox>
      <Section className="mt-6 flex items-start justify-between gap-10">
        <ActivityTypeCost />
        <PondCost />
      </Section>
    </>
  )
}
