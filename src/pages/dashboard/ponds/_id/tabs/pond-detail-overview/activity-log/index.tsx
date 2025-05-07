import { DataTable } from 'src/components/ui/data-table'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { columns } from './columns'

const activityLogs = [
  {
    date: '02/04/2025',
    activityType: 'Feeding',
    description: 'Fed 20kg Top Feed',
  },
  {
    date: '02/04/2025',
    activityType: 'Feeding',
    description: 'Fed 20kg Top Feed',
  },
  {
    date: '02/04/2025',
    activityType: 'Feeding',
    description: 'Fed 20kg Top Feed',
  },
]

export default function ActivityLogTable() {
  const isLoading = false

  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Text className="text-xl font-semibold text-neutral-700">Activity Log</Text>
      <DataTable
        search={false}
        columns={columns}
        data={activityLogs ?? []}
        isLoading={isLoading}
        emptyStateMessage="No activity found"
      />
    </FlexBox>
  )
}
