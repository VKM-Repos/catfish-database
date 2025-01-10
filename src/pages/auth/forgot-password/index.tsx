import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ForgetPassword from './forms/forget-password'
import Confirmation from './forms/email-confirmation'
import { AnimatePresence } from 'framer-motion'

export default function ForgotPassword() {
  const { t } = useTranslation('translation')
  const [step, setStep] = useState(1)

  const ResetPasswordForms = () => {
    const handleNext = () => {
      setStep(step + 1)
    }

    switch (step) {
      case 1:
        return <ForgetPassword handleNext={handleNext} />
      case 2:
        return <Confirmation />
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
