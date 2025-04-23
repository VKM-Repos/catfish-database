import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedUserResponseSchema } from 'src/schemas/schemas'
import EmptyTableState from 'src/components/global/empty-state'
import EmptyAdminImg from 'src/assets/images/empty-admin.jpg'

export function AdminsTable() {
  const useGetClusterManagers = createGetQueryHook({
    endpoint: '/users/cluster-managers',
    responseSchema: paginatedUserResponseSchema,
    queryKey: ['cluster-managers'],
  })
  const { data: cluster_manager, isLoading } = useGetClusterManagers()
  const admins: any = []

  const openCreateModal = () => {
    return
  }

  return (
    <>
      {admins && admins.length > 0 ? (
        <DataTable
          columns={columns}
          data={cluster_manager?.content ?? []}
          isLoading={isLoading}
          emptyStateMessage="No users found"
        />
      ) : (
        <EmptyTableState name="admin" text="an admin" image={EmptyAdminImg} buttonFunc={openCreateModal} />
      )}
    </>
  )
}
