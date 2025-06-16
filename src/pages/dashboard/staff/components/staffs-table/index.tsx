import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import EmptyTableState from 'src/components/global/empty-state'
import { useNavigate } from 'react-router-dom'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { paths } from 'src/routes'

const data = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    email: 'string',
    role: 'SUPER_ADMIN',
    firstName: 'string',
    lastName: 'string',
    phone: '070414444',
    address: 'string',
    defaultPassword: true,
    accountNonLocked: true,
    enabled: true,
    banUntil: '2025-06-15T20:22:38.961Z',
    context: 'string',
    createdAt: '2025-06-15T20:22:38.961Z',
    updatedAt: '2025-06-15T20:22:38.961Z',
    cluster: {
      id: 'string',
      name: 'string',
      state: {
        id: 9007199254740991,
        name: 'string',
      },
      description: 'string',
      context: 'string',
      createdDate: '2025-06-15T20:22:38.961Z',
      lastModifiedDate: '2025-06-15T20:22:38.961Z',
      roles: ['edit'],
    },
  },
]

export function StaffsTable() {
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.ponds.create.addPond)
  }

  // const useGetFishBatches = createGetQueryHook({
  //   endpoint: '/fish-batches',
  //   responseSchema: z.any(),
  //   queryKey: ['fish-batches'],
  // })

  // const useFetchPonds = createGetQueryHook({
  //   endpoint: '/ponds/farmers/me',
  //   responseSchema: z.any(),
  //   queryKey: ['my-ponds'],
  // })

  // const { data: fishBatches, isLoading: isFishBatchesLoading } = useGetFishBatches()
  // const { data: ponds, isLoading: isPondsLoading } = useFetchPonds()

  // if (isPondsLoading || isFishBatchesLoading) return <LoadingScreen />

  // const totalPonds = ponds && fishBatches ? mergePondsWithTotalFishQuantity(ponds, fishBatches) : 0

  return (
    <>
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data ?? []} emptyStateMessage="No staff found" />
      ) : (
        <EmptyTableState image={EmptyClusterManagerImg} name="staff" text="staff" buttonFunc={openCreateModal} />
      )}
    </>
  )
}
