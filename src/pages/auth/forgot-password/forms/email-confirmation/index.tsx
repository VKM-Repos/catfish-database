import { useTranslation } from 'react-i18next'
import PageTransition from 'src/components/animations/page-transition'
import { Card } from 'src/components/layouts/card'
import { Container } from 'src/components/layouts/container'
import CardHeader from 'src/components/layouts/card-header'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

export default function Confirmation() {
  const { t } = useTranslation('translation')

  const heading = 'Email Sent!'
  const subheading = 'Check your inbox for instructions on how to reset your password.'
  const footerContent: ReactNode = (
    <div className="mx-auto flex w-full max-w-fit cursor-default gap-1 text-sm">
      <span className="text-neutral-400">Didn&apos;t receive an email? </span>
      <span>
        <Link to="/login" className="pointer-events-none font-semibold text-neutral-700">
          Resend email
        </Link>
      </span>
    </div>
  )

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto w-full max-w-[26rem]  font-inter" footer={true} footerContent={footerContent}>
          <CardHeader heading_string={heading} subheading={subheading} />
        </Card>
      </Container>
    </PageTransition>
  )
}
