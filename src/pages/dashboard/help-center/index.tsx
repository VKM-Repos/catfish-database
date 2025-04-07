import { Container } from 'src/components/ui/container'
import { Center } from 'src/components/ui/center'
import PageTransition from 'src/components/animation/page-transition'
import * as SolarIconSet from 'solar-icon-set'
import { PageHeader } from 'src/components/ui/page-header'

export default function HelpCenter() {
  const title = 'Help Center'
  const actions = null
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
