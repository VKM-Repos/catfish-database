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

export default function FarmersPage() {
  const title = 'Farmers'
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.farmers.create)
  }

  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add Farmers</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative pb-10">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} />
          <Spacer />
          <FarmersTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
