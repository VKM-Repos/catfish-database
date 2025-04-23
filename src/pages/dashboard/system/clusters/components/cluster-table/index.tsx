import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { clusterResponseSchema, paginatedUserResponseSchema } from 'src/schemas/schemas'
import { z } from 'zod'

export function ClusterTable() {
  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.array(clusterResponseSchema),
    queryKey: ['clusters'],
  })

  const useGetClusterManagers = createGetQueryHook({
    endpoint: '/users/cluster-managers',
    responseSchema: paginatedUserResponseSchema,
    queryKey: ['cluster-managers'],
  })

  const { data: clusters = [], isLoading: loadingClusters } = useGetClusters()
  const { data: clusterManagerResponse, isLoading: loadingManagers } = useGetClusterManagers()
  const clusterManagers = clusterManagerResponse?.content || []

  const clustersWithManagers: any = clusters.map((cluster) => ({
    ...cluster,
    users: clusterManagers.filter((manager) => manager.cluster?.id === cluster.id),
  }))

  return (
    <DataTable
      isLoading={loadingClusters}
      columns={columns}
      data={clustersWithManagers}
      emptyStateMessage="No clusters found"
    />
  )
}
