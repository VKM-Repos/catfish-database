import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Heading } from 'src/components/ui/heading'
import { FarmersForm } from './forms/farmers-form'

export default function CreateFarmersPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.farmers.root)
  }

  return (
    <Dialog open onOpenChange={() => navigate(paths.dashboard.farmers.root)}>
      <DialogContent
        className={`h-[500px] max-w-[350px] overflow-hidden p-4 lg:max-h-[600px] lg:max-w-[578px] ${
          step === 1 ? 'overflow-y-scroll' : null
        }`}
      >
        <div className={`pt-[4rem] pb-${step === 1 ? '1' : '[2rem]'}`}>
          {(() => {
            switch (step) {
              case 1:
                return <FarmersForm mode="create" onSuccess={handleSuccess} onClose={handleClose} />
              case 2:
                return (
                  <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
                    <Heading level={6}>Completed!</Heading>
                    <Text weight="light" size="base">
                      Farmer created successfully!
                    </Text>
                    <Button variant="primary" onClick={handleClose}>
                      Continue
                    </Button>
                  </div>
                )
              default:
                return null
            }
          })()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
