import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import UpdateSamplingReportForm from './update-sampling-report-form'

export default function EditFeedingReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  if (!id) {
    return null
  }

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <UpdateSamplingReportForm setStep={setStep} />
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Sampling report updated successfully!</Text>
            <Button
              variant="primary"
              onClick={() => {
                navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)
                setTimeout(() => {
                  setStep(1)
                }, 1000)
              }}
            >
              Continue
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="max-h-[80vh] max-w-[750px] overflow-y-scroll p-8"
      >
        <RenderSteps />
      </DialogContent>
    </Dialog>
  )
}
