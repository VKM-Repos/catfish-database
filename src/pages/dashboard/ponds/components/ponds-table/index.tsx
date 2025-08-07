import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { mergePondsWithTotalFishQuantity } from 'src/lib/utils'
import { z } from 'zod'

export function PondsTable() {
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.ponds.create.addPond)
  }

  const useGetFishBatches = createGetQueryHook({
    endpoint: '/fish-batches',
    responseSchema: z.any(),
    queryKey: ['fish-batches-in-ponds'],
  })

  const useFetchPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds-in-ponds'],
  })

  const { data: fishBatches, isLoading: isFishBatchesLoading } = useGetFishBatches({
    query: { size: 1000, sortBy: 'DESC' },
  })
  const { data: ponds, isLoading: isPondsLoading } = useFetchPonds({
    query: { size: 1000, sortBy: 'DESC' },
  })

  const totalPonds = ponds && fishBatches ? mergePondsWithTotalFishQuantity(ponds, fishBatches) : 0
  const isLoading = isPondsLoading || isFishBatchesLoading

  return (
    <>
      {!isLoading && totalPonds <= 0 ? (
        <EmptyTableState image={EmptyClusterManagerImg} name="pond" text="a pond" buttonFunc={openCreateModal} />
      ) : (
        <DataTable columns={columns} data={totalPonds ?? []} isLoading={isLoading} emptyStateMessage="No ponds found" />
      )}
    </>
  )
}
