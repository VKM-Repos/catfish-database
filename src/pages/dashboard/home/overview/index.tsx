import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import { PageHeader } from 'src/components/ui/page-header'
import { Menubar } from 'src/components/layouts/dashboard/menubar'

export default function DashboardOverviewPage() {
  const title = 'Overview'

  return (
    <PageTransition>
      <Menubar />
      <Container className="min-h-[150dvh] !px-12">
        <PageHeader title={title} />
      </Container>
    </PageTransition>
  )
}
