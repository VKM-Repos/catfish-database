import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'

export function PondsTable() {
  const isLoading = false
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.ponds.create)
  }

  return (
    <>
      {ponds && ponds.length < 0 ? (
        <DataTable columns={columns} data={ponds ?? []} isLoading={isLoading} emptyStateMessage="No ponds found" />
      ) : (
        <EmptyTableState image={EmptyClusterManagerImg} name="pond" text="a pond" buttonFunc={openCreateModal} />
      )}
    </>
  )
}

export const ponds = [
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
  {
    pondName: 'Pond 1A',
    fishQuantity: '1,800',
    weight: '320g',
    lastSampled: '02/04/2025',
    pondStatus: true,
  },
]
