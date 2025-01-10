import { useTranslation } from 'react-i18next'
import PageTransition from 'src/components/animations/page-transition'
import { Card } from 'src/components/layouts/card'
import { Container } from 'src/components/layouts/container'
import CardHeader from 'src/components/layouts/card-header'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/button'

export default function ResetComplete() {
  const { t } = useTranslation('translation')
  const navigate = useNavigate()

  const heading = 'Password reset complete!'
  const subheading = 'You have successfully reset your password, please login to your account.'

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto w-full max-w-[29rem] font-inter">
          <CardHeader heading_string={heading} subheading={subheading} />
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="my-4 flex w-full gap-2 focus:outline-none"
          >
            Login
          </Button>
        </Card>
      </Container>
    </PageTransition>
  )
}
