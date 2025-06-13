import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import FeedStockForm from './feed-stock-form'
import { Heading } from 'src/components/ui/heading'

export default function AddFeedStock() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const location = useLocation()
  const { from } = useParams<{ from: string }>()

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
              <Heading className="text-center" level={6}>
                {location.state ? `Add ${location.state?.item.type} feed stock` : 'Add feed stock'}
              </Heading>
            </div>
            <FeedStockForm mode="create" setStep={setStep} onCancel={goBack} />
          </>
        )
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Feeding report updated successfully!</Text>
            <Button
              variant="primary"
              onClick={() => {
                navigate(`${paths.dashboard.inventory.root}`)
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

  const goBack = () => {
    if (from == 'overview') navigate(paths.dashboard.home.overview)
    else if (from == 'inventory') navigate(paths.dashboard.inventory.root)
  }
  return (
    <Dialog open={true} onOpenChange={goBack}>
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
