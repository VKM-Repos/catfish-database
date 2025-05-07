import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useParams } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'

export function StockingHistoryTable() {
  const { id } = useParams<{ id: string }>()
  const isLoading = false

  const openCreateModal = () => {
    console.log('Add stock')
  }

  return (
    <>
      {stockingHistory && stockingHistory.length > 0 ? (
        <DataTable
          search={false}
          columns={columns}
          data={stockingHistory ?? []}
          isLoading={isLoading}
          emptyStateMessage="No stocking history found"
        />
      ) : (
        <EmptyTableState
          image={EmptyClusterManagerImg}
          name="new stock"
          text="new stock"
          buttonFunc={openCreateModal}
        />
      )}
    </>
  )
}

export const stockingHistory = [
  {
    date: '02/04/2025',
    quantity: '2500',
    averageWeight: '8g',
    averageSize: '1.5mm',
    supplyCost: '₦75,000',
  },
  {
    date: '02/04/2025',
    quantity: '2500',
    averageWeight: '8g',
    averageSize: '1.5mm',
    supplyCost: '₦75,000',
  },
  {
    date: '02/04/2025',
    quantity: '2500',
    averageWeight: '8g',
    averageSize: '1.5mm',
    supplyCost: '₦75,000',
  },
  {
    date: '02/04/2025',
    quantity: '2500',
    averageWeight: '8g',
    averageSize: '1.5mm',
    supplyCost: '₦75,000',
  },
  {
    date: '02/04/2025',
    quantity: '2500',
    averageWeight: '8g',
    averageSize: '1.5mm',
    supplyCost: '₦75,000',
  },
]
