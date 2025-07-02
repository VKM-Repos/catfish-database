import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { memo } from 'react'

interface UsersTableProps {
  data: any[]
  isLoading: boolean
}

function UsersTableComponent({ data, isLoading }: UsersTableProps) {
  return (
    <DataTable
      search={false}
      hideClusterFilter={false}
      isLoading={isLoading}
      columns={columns}
      data={data}
      emptyStateMessage="No users found"
    />
  )
}

// Memoize the component to prevent unnecessary re-renders
export const UsersTable = memo(UsersTableComponent)
