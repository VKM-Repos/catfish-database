import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedUserResponseSchema } from 'src/schemas/schemas'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import EmptyTableState from 'src/components/global/empty-state'
import EmptyClusterImg from 'src/assets/images/empty-cluster.jpg'

export function ClusterTable({ useGetClusters }: any) {
  const navigate = useNavigate()

  const useGetClusterManagers = createGetQueryHook({
    endpoint: '/users/cluster-managers',
    responseSchema: paginatedUserResponseSchema,
    queryKey: ['cluster-managers'],
  })

  const { data: clusters = [], isLoading: loadingClusters } = useGetClusters()
  const { data: clusterManagerResponse, isLoading: loadingManagers } = useGetClusterManagers()
  const clusterManagers = clusterManagerResponse?.content || []

  if (loadingClusters || loadingManagers) {
    return <div>Loading...</div>
  }

  const clustersWithManagers: any = clusters.map((cluster: any) => ({
    ...cluster,
    users: clusterManagers.filter((manager) => manager.cluster?.id === cluster.id),
  }))

  const openCreateModal = () => {
    navigate(paths.dashboard.system.clusters.create)
  }

  return (
    <>
      {clustersWithManagers && clustersWithManagers.length > 0 ? (
        <DataTable columns={columns} data={clustersWithManagers} emptyStateMessage="No clusters found" />
      ) : (
        <EmptyTableState name="cluster" text="a cluster" image={EmptyClusterImg} buttonFunc={openCreateModal} />
      )}
    </>
  )
}
