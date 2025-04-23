import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedUserResponseSchema } from 'src/schemas/schemas'

export function FarmersTable() {
  const useGetFarmers = createGetQueryHook({
    endpoint: '/users/farmers?direction=DESC',
    responseSchema: paginatedUserResponseSchema,
    queryKey: ['farmers'],
  })
  const { data: farmers, isLoading } = useGetFarmers()

  return (
    <DataTable
      columns={columns}
      data={farmers?.content ?? []}
      isLoading={isLoading}
      emptyStateMessage="No users found"
    />
  )
}
