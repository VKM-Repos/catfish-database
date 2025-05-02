import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'

export default function MaintenanceLogsTable() {
  return (
    <DataTable
      search={false}
      columns={columns}
      data={maintenanceLogs ?? []}
      isLoading={false}
      emptyStateMessage="No maintenance logs found"
    />
  )
}

const maintenanceLogs = [
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
  {
    date: '02/04/2025',
    activityType: 'Topfeed 4mm',
    cost: '25',
    description: 'Full drain after heavy rain',
  },
]
