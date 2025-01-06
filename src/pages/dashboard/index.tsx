import { Container } from '../../components/layouts/container'
import { Section } from 'src/components/layouts/section'
import { Center } from 'src/components/layouts/center'
import PageTransition from 'src/components/animations/page-transition'

export default function Dashboard() {
  return (
    <PageTransition>
      <Container>
        <Section>
          <Center>
            <p>dashboard page</p>
          </Center>
        </Section>
      </Container>
    </PageTransition>
  )
}
