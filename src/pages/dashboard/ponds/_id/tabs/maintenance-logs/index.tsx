import { useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import MaintenanceLogsTable from './table'

export default function MaintenanceLogs() {
  const { id } = useParams<{ id: string }>()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Maintenance Logs</Text>
      </FlexBox>
      <MaintenanceLogsTable />
    </FlexBox>
  )
}
