import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
// import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'

export default function NotificationTable() {
  const navigate = useNavigate()

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
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <DataTable columns={columns} data={[]} isLoading={false} emptyStateMessage="No Notification found" />
    </FlexBox>
  )
}
