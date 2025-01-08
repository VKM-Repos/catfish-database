import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ForgotPassword from './forms/forgot-password'
import Confirmation from './forms/email-confirmation'
import ChoosePassword from './forms/choose-password'
import ResetComplete from './forms/reset-complete'
import { AnimatePresence } from 'framer-motion'

export default function ResetPassword() {
  const { t } = useTranslation('translation')
  const [step, setStep] = useState(1)

  const ResetPasswordForms = () => {
    const handleNext = () => {
      setStep(step + 1)
    }

    useEffect(() => {
      if (step !== 2) return

      const timer = setTimeout(() => {
        setStep(3)
      }, 4000)

      return () => clearTimeout(timer)
    }, [step])

    switch (step) {
      case 1:
        return <ForgotPassword handleNext={handleNext} />
      case 2:
        return <Confirmation />
      case 3:
        return <ChoosePassword handleNext={handleNext} />
      case 4:
        return <ResetComplete />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <ResetPasswordForms />
    </AnimatePresence>
  )
}
