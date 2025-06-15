import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { clusterResponseSchema, paginatedUserResponseSchema } from 'src/schemas/schemas'
import { z } from 'zod'
import EmptyTableState from 'src/components/global/empty-state'
import EmptyFarmersImg from 'src/assets/images/empty-admin.jpg'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'

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
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.system.clusters.create)
  }
  return (
    <>
      {clustersWithManagers && clustersWithManagers.length > 0 ? (
        <DataTable
          isLoading={loadingClusters}
          columns={columns}
          data={clustersWithManagers}
          emptyStateMessage="No clusters found"
        />
      ) : (
        <EmptyTableState image={EmptyFarmersImg} name="cluster" text="a cluster" buttonFunc={openCreateModal} />
      )}
    </>
  )
}
