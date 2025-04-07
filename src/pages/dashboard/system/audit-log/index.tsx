import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { AuditLogTable } from './components/audit-log-table'

export default function AuditLogPage() {
  const title = 'Audit Log'

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={null} />
          <Spacer />
          <AuditLogTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
