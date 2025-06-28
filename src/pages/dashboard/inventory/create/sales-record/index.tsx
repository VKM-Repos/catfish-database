import { useLocation, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import SalesRecordsForm from './sales-record-form'

export default function AddSalesRecord() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const location = useLocation()

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
              <Heading className="text-center" level={6}>
                {location.state ? `Edit sales record` : 'Add sales record'}
              </Heading>
            </div>
            <SalesRecordsForm
              mode="create"
              setStep={setStep}
              onCancel={() => navigate(`${paths.dashboard.inventory.root}?tab=sales-records`)}
            />
          </>
        )
      case 2:
        return (
          <div className="my-8 flex w-fit flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Sales record added!</Text>
            <Button
              variant="primary"
              onClick={() => {
                navigate(`${paths.dashboard.inventory.root}?tab=sales-records`)
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
    <Dialog open={true} onOpenChange={() => navigate(`${paths.dashboard.inventory.root}?tab=sales-records`)}>
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
