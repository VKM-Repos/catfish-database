import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import * as SolarIconSet from 'solar-icon-set'

export default function ClustersPage() {
  const title = 'Permissions'

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={null} />
          <Spacer />
          <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
