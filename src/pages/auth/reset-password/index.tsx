import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    <AnimatePresence>
      <ResetPasswordForms />
    </AnimatePresence>
  )
}
