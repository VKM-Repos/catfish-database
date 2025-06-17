import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { mergePondsWithTotalFishQuantity } from 'src/lib/utils'
import { LoadingScreen } from 'src/components/global/loading-screen'
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

  const { data: fishBatches, isLoading: isFishBatchesLoading } = useGetFishBatches()
  const { data: ponds, isLoading: isPondsLoading } = useFetchPonds()

  if (isPondsLoading || isFishBatchesLoading) return <LoadingScreen />

  const totalPonds = ponds && fishBatches ? mergePondsWithTotalFishQuantity(ponds, fishBatches) : 0

  return (
    <>
      {totalPonds && totalPonds.length > 0 ? (
        <DataTable columns={columns} data={totalPonds ?? []} emptyStateMessage="No ponds found" />
      ) : (
        <EmptyTableState image={EmptyClusterManagerImg} name="pond" text="a pond" buttonFunc={openCreateModal} />
      )}
    </>
  )
}
