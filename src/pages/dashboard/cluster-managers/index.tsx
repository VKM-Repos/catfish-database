import { Container } from 'src/components/layouts/container'
import PageTransition from 'src/components/animations/page-transition'
import { PageHeader } from 'src/components/layouts/page-header'
import { ClusterManagerTable } from './components/cluster-manager-table'
import { ImportDialog } from './components/import-dialog'
import { AddClusterManagerFormDialog } from './components/add-cluster-manager-form-dialog'

export default function ClusterManagers() {
  const title = 'Cluster Managers'
  const actions = (
    <div className="mb-10 flex items-center justify-center gap-3">
      <ImportDialog />
      <AddClusterManagerFormDialog />
    </div>
  ) // button goes here
  return (
    <PageTransition>
      <Container>
        <PageHeader title={title} actions={actions} />
        <ClusterManagerTable />
      </Container>
    </PageTransition>
  )
}
