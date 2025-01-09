import { Container } from 'src/components/layouts/container'
import { Center } from 'src/components/layouts/center'
import PageTransition from 'src/components/animations/page-transition'
import * as SolarIconSet from 'solar-icon-set'
import { PageHeader } from 'src/components/layouts/page-header'

export default function ClusterManagers() {
  const title = 'Cluster Managers'
  const actions = <></> // button goes here
  return (
    <PageTransition>
      <Container>
        <PageHeader title={title} actions={actions} />
        <Center>
          <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" />
        </Center>
      </Container>
    </PageTransition>
  )
}
