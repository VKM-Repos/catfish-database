import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { mergePondsWithTotalFishQuantity } from 'src/lib/utils'
import { z } from 'zod'
import { useAuthStore } from 'src/store/auth.store'

export function PondsTable() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const isLoading = false
  const navigate = useNavigate()

  const useGetFishBatches = createGetQueryHook({
    endpoint: '/fish-batches',
    responseSchema: z.any(),
    queryKey: ['fish-batches'],
  })

  const useFetchPonds = createGetQueryHook({
    endpoint: `/ponds/clusters/me?farmerId=${id}`,
    responseSchema: z.any(),
    queryKey: ['all-ponds'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })
  const useFetchPondsByAdmin = createGetQueryHook({
    endpoint: `/ponds?farmerId=${id}`,
    responseSchema: z.any(),
    queryKey: ['all-ponds'],
    options: {
      enabled: user?.role === 'SUPER_ADMIN',
    },
  })

  const { data: fishBatches } = useGetFishBatches()
  const { data: ponds } = useFetchPonds()
  const { data: ponds_admin } = useFetchPondsByAdmin()

  const totalPonds = (ponds || ponds_admin) && fishBatches ? mergePondsWithTotalFishQuantity(ponds, fishBatches) : 0

  const farmer = ponds?.content.find((farmer: any) => farmer.farmer.id === id)

  const redirectPath = () => {
    const navigatePath = id
      ? `${paths.dashboard.ponds.create.addPond}?farmerId=${encodeURIComponent(id)}&clusterId=${farmer?.cluster.id}`
      : paths.dashboard.ponds.create.addPond

    navigate(navigatePath)
  }

  return (
    <div className="w-full">
      {totalPonds && totalPonds.length > 0 ? (
        <DataTable columns={columns} data={totalPonds ?? []} isLoading={isLoading} emptyStateMessage="No ponds found" />
      ) : (
        <EmptyTableState image={EmptyClusterManagerImg} name="pond" text="a pond" buttonFunc={redirectPath} />
      )}
    </div>
  )
}
