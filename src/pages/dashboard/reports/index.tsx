import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { ClusterManagersTable } from './components/cluster-managers-table'

export default function ReportsPage() {
  const title = 'Reports'

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={null} />
          <Spacer />
          <ClusterManagersTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
