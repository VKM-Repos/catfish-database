import { Outlet } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import * as SolarIconSet from 'solar-icon-set'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { RolesTable } from './components/role-table'

export default function RolesPermissionsPage() {
  const title = 'Roles & Permissions'

  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={() => console.log('test')}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add new role</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative mb-20">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} subtitle="Manage user roles and their permissions." />
          <Spacer />
          {/* <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" /> */}
          <RolesTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
