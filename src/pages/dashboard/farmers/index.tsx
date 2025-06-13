import { Outlet, useNavigate } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Inline } from 'src/components/ui/inline'
import { Spacer } from 'src/components/ui/spacer'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { FarmersTable } from './components/farmers-table'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

export default function FarmersPage() {
  const title = 'Farmers'
  const navigate = useNavigate()

  const useGetFarmers = createGetQueryHook({
    endpoint: '/users/farmers?direction=DESC',
    responseSchema: z.any(),
    queryKey: ['farmers'],
  })

  const openCreateModal = () => {
    navigate(paths.dashboard.farmers.create)
  }

  const { data: farmers } = useGetFarmers()

  const actions = farmers && farmers?.content.length > 0 && (
    <Inline>
      <Button variant="outline" className="flex items-center gap-2 border-primary-400">
        <SolarIconSet.CircleBottomUp color="#651391" size={20} iconStyle="Outline" />
        <Text className="text-primary-400">Import</Text>
      </Button>
      <Button variant="primary" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add Farmers</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative pb-[5rem]">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} />
          <Spacer />
          <FarmersTable useGetFarmers={useGetFarmers} />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
