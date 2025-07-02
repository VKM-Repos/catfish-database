import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { LoadingScreen } from 'src/components/global/loading-screen'

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
  const useGetFarmerStaff = createGetQueryHook({
    endpoint: '/users//by-owning-farmer',
    responseSchema: z.any(),
    queryKey: ['Farmer-Staffs'],
  })

  const { data: staffs, isLoading: isStaffsLoading } = useGetFarmerStaff()

  if (isStaffsLoading) return <LoadingScreen />

  return (
    <>
      {data && data.length > 0 && (
        <DataTable columns={columns} data={staffs.content ?? []} emptyStateMessage="No staff found" />
      )}
    </>
  )
}
