import { useNavigate, useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { PondsTable } from './table'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes'
import { farmerResponseSchema, paginatedPondResponseSchema } from 'src/schemas'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { useAuthStore } from 'src/store/auth.store'

export default function Ponds() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const useFetchClusterManagerPonds = createGetQueryHook({
    endpoint: `/ponds/clusters/me`,
    responseSchema: paginatedPondResponseSchema,
    queryKey: ['all-ponds'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })

  const useFetchPondsByAdmin = createGetQueryHook({
    endpoint: `/ponds`,
    responseSchema: paginatedPondResponseSchema,
    queryKey: ['all-ponds'],
    options: {
      enabled: user?.role === 'SUPER_ADMIN',
    },
  })

  const useGetFarmer = createGetQueryHook<typeof farmerResponseSchema, { id: string }>({
    endpoint: '/users/:id',
    responseSchema: farmerResponseSchema,
    queryKey: ['farmer-details'],
  })

  const args = { query: { farmerId: id } }

  const { data: clusterManagerPonds } = useFetchClusterManagerPonds(args)
  const { data: adminPonds } = useFetchPondsByAdmin(args)
  const { data: farmer } = useGetFarmer({ route: { id: id! } })

  const ponds = user?.role === 'CLUSTER_MANAGER' ? clusterManagerPonds : adminPonds

  const clusterId = farmer?.cluster?.id ?? ''

  const redirectPath = () => {
    const navigatePath = id
      ? `${paths.dashboard.ponds.create.addPond}?farmerId=${encodeURIComponent(id)}&clusterId=${clusterId}`
      : paths.dashboard.ponds.create.addPond
    navigate(navigatePath)
  }

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Ponds</Text>
        {ponds && ponds?.content.length > 0 && (
          <Button variant="outline" className="border-primary-400" onClick={redirectPath}>
            <FlexBox gap="gap-3" align="center">
              <SolarIconSet.AddCircle color="#651391" size={20} iconStyle="Outline" />
              <Text className="text-primary-400">Add pond</Text>
            </FlexBox>
          </Button>
        )}
      </FlexBox>
      <PondsTable clusterId={clusterId} />
    </FlexBox>
  )
}
