import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import { FlexBox } from 'src/components/ui/flexbox'

export default function NewEntryPage() {
  return (
    <PageTransition>
      <Container className="min-h-[150dvh]">
        <FlexBox direction="col" justify="center" align="start" gap="gap-8" className="w-full cursor-default">
          Hello world
        </FlexBox>
      </Container>
    </PageTransition>
  )
}
