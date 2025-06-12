import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import RulesCard from './components/rulesCard'

export default function farmRulesPage() {
  const title = 'Farm rules'

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader
            title={title}
            // actions={actions}
            subtitle="Set system-wide constraints and defaults for farm operations."
          />
          {/* <Spacer />
          <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" /> */}
          <RulesCard />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
