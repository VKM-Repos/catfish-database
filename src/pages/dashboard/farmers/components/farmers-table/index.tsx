import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyFarmersImg from 'src/assets/images/empty-admin.jpg'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'

export function FarmersTable({ useGetFarmers }: any) {
  const { data: farmers, isLoading } = useGetFarmers()

  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.farmers.create)
  }

  return (
    <>
      {farmers && farmers?.content.length > 0 ? (
        <DataTable
          columns={columns}
          data={farmers?.content ?? []}
          isLoading={isLoading}
          emptyStateMessage="No users found"
        />
      ) : (
        <EmptyTableState image={EmptyFarmersImg} name="farmer" text="a farmer" buttonFunc={openCreateModal} />
      )}
    </>
  )
}
