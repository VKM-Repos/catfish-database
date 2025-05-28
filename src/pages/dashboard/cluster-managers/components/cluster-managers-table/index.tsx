import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'

export function ClusterManagersTable({ useGetClusterManagers }: any) {
  const { data: cluster_managers, isLoading } = useGetClusterManagers()

  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.clusterManagers.create)
  }

  return (
    <>
      {cluster_managers && cluster_managers?.content.length > 0 ? (
        <DataTable
          columns={columns}
          data={cluster_managers?.content ?? []}
          isLoading={isLoading}
          emptyStateMessage="No users found"
        />
      ) : (
        <EmptyTableState
          image={EmptyClusterManagerImg}
          name="cluster manager"
          text="a cluster manager"
          buttonFunc={openCreateModal}
        />
      )}
    </>
  )
}
