import { Container } from 'src/components/layouts/container'
import PageTransition from 'src/components/animations/page-transition'
import { PageHeader } from 'src/components/layouts/page-header'
import { ClusterManagerTable } from './components/cluster-manager-table'
import { ImportDialog } from './components/import-dialog'
import { AddClusterManagerFormDialog } from './components/add-cluster-manager-form-dialog'
import { Inline } from 'src/components/layouts/inline'
import { Spacer } from 'src/components/layouts/spacer'
import * as SolarIconSet from 'solar-icon-set'

export default function ClusterManagers() {
  const title = 'Cluster Managers'
  const actions = (
    <Inline>
      <ImportDialog />
      <AddClusterManagerFormDialog
        icon={<SolarIconSet.AddCircle size={20} />}
        buttonTitle="Add cluster manager"
        buttonVariant="primary"
        buttonSize="sm"
        action="add"
      />
    </Inline>
  ) // button goes here
  return (
    <PageTransition>
      <Container>
        <PageHeader title={title} actions={actions} />
        <Spacer />
        <ClusterManagerTable />
      </Container>
    </PageTransition>
  )
}
