import { Outlet, useNavigate } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { paths } from 'src/routes/paths'
import { ClusterTable } from './components/cluster-table'

export default function ClustersPage() {
  const title = 'Audit log'
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.system.clusters.create)
  }

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={null} />
          <Spacer />
          <ClusterTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
