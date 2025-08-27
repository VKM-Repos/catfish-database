import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Heading } from 'src/components/ui/heading'
import { DiseaseForm } from '../components/forms/disease-form'
import { BehaviorForm } from '../components/forms/behavior-form'
import { MaintenanceForm } from '../components/forms/maintenance-form'
import { WaterQualityForm } from '../components/forms/water-quality-form'
import { WaterSourceForm } from '../components/forms/water-source-form'
import { FeedForm } from '../components/forms/feed-form'

export default function EditForm() {
  const location = useLocation()
  const modalOpt = location.state?.modalOpt
  const initialValues = location.state?.data
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.system.farmRules.root)
  }

  return (
    <Dialog open onOpenChange={() => navigate(paths.dashboard.system.farmRules.root)}>
      <DialogContent className="max-w-[478px] overflow-hidden p-8">
        <div className="py-[4rem] pb-[6rem]">
          {(() => {
            switch (step) {
              case 1:
                return modalOpt === 'feed' ? (
                  <FeedForm mode="edit" initialValues={initialValues} onSuccess={handleSuccess} onClose={handleClose} />
                ) : modalOpt === 'water_quality' ? (
                  <WaterQualityForm
                    mode="edit"
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                ) : modalOpt === 'water_source' ? (
                  <WaterSourceForm
                    mode="edit"
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                ) : modalOpt === 'maintenance' ? (
                  <MaintenanceForm
                    mode="edit"
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                ) : modalOpt === 'behavior' ? (
                  <BehaviorForm
                    mode="edit"
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                ) : modalOpt === 'disease' ? (
                  <DiseaseForm
                    mode="edit"
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                ) : null
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
