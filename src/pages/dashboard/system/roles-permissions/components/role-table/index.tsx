import { columns } from './columns'
import { DataTable } from 'src/components/ui/data-table'

type RolesTableProps = {
  permissionsByRole: any[]
  isLoading: boolean
}

export function RolesTable({ permissionsByRole, isLoading }: RolesTableProps) {
  return <DataTable columns={columns} data={permissionsByRole} isLoading={isLoading} search={false} />
}
