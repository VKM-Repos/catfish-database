import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedUserResponseSchema } from 'src/schemas/schemas'

export function ClusterManagersTable() {
  const useGetClusterManagers = createGetQueryHook({
    endpoint: `/users/cluster-managers?sortBy=firstName&direction=ASC`,
    responseSchema: paginatedUserResponseSchema,
    queryKey: ['cluster-managers'],
  })
  const { data: cluster_manager, isLoading } = useGetClusterManagers()

  console.log(cluster_manager)

  return (
    <DataTable
      columns={columns}
      data={cluster_manager?.content ?? []}
      isLoading={isLoading}
      emptyStateMessage="No users found"
    />
  )
}
