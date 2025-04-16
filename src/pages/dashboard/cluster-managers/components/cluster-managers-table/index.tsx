import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

export function ClusterManagersTable() {
  const useGetClusterManagers = createGetQueryHook({
    endpoint: `/users/cluster-managers?sortBy=firstName&direction=ASC`,
    responseSchema: z.any(),
    queryKey: ['cluster-managers'],
  })
  const { data: cluster_manager, isLoading } = useGetClusterManagers()

  return (
    <DataTable
      columns={columns}
      data={cluster_manager?.content ?? []}
      isLoading={isLoading}
      emptyStateMessage="No users found"
    />
  )
}
