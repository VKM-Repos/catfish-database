import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChoosePassword from './forms/choose-password'
import ResetComplete from './forms/reset-complete'
import { Card, CardHeader, CardContent, CardFooter } from 'src/components/ui/card'
import { Container } from 'src/components/ui/container'
import { Link } from 'react-router-dom'
import { Logo } from 'src/components/ui/logo'
import { Heading } from 'src/components/ui/heading'

export default function ResetPassword() {
  const { t } = useTranslation('translation')
  const [step, setStep] = useState(1)

  const ResetPasswordForms = () => {
    const handleNext = () => {
      setStep(step + 1)
    }

    switch (step) {
      case 1:
        return <ChoosePassword handleNext={handleNext} />
      case 2:
        return <ResetComplete />
      default:
        return null
    }
  }

  return (
    <Container className="w-fit overflow-hidden">
      <Card className="mx-auto flex h-fit w-full max-w-[470px] flex-col gap-2 bg-white p-1 leading-tight tracking-wide lg:min-w-[470px]">
        <CardHeader className="flex flex-col items-center justify-center gap-y-8">
          <div className="flex flex-col items-center justify-center">
            <Logo className="text-primary h-[50px] w-[55px] p-1" />
            <Heading level={5} className="font-semibold text-primary-500">
              Catfish Database
            </Heading>
          </div>
        </CardHeader>
        <CardContent>
          <ResetPasswordForms />
        </CardContent>
        <CardFooter className="flex h-[56px] flex-col items-center justify-center rounded-lg bg-neutral-100">
          <span className="mt-4 text-sm text-neutral-400">
            Powered by
            <Link to="https://www.fao.org/fish4acp" className="ml-2 font-semibold text-info-500 underline">
              FISH4ACP
            </Link>
          </span>
        </CardFooter>
      </Card>
    </Container>
  )
}
