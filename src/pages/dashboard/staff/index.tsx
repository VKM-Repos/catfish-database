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
import { StaffsTable } from './components/staffs-table'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { staffUserResponseSchema } from 'src/schemas'

const useGetStaffs = createGetQueryHook({
  endpoint: '/users/farmers',
  responseSchema: staffUserResponseSchema,
  queryKey: ['staffs'],
})

export default function StaffsPage() {
  const title = 'Staff'
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.staff.create)
  }

  const { data: staffs } = useGetStaffs()

  // const actions = staffs && staffs?.content.length > 0 && (
  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add Staff</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative pb-[5rem]">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} />
          <Spacer />
          <StaffsTable />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
