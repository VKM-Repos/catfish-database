import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import * as SolarIconSet from 'solar-icon-set'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { AuditLogTable } from './components/audit-log'

export default function ClustersPage() {
  const title = 'Audit log'

  const actions = (
    <Inline>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => console.log('test')}>
        <SolarIconSet.DownloadMinimalistic size={20} />
        <Text>Export logs</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader
            title={title}
            actions={actions}
            subtitle="View detailed audit trails of all actions and changes made within the system."
          />
          <Spacer />
          {/* <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" /> */}
          <AuditLogTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
