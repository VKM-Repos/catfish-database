import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
// import FeedStockForm from './staff-form'
import { Heading } from 'src/components/ui/heading'
import { StaffForm } from './staff-form'

export default function AddStaff() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.staff.root)
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-h-[80vh] max-w-[600px] overflow-y-scroll p-8">
        <div className="py-[4rem] pb-[1rem]">
          {(() => {
            switch (step) {
              case 1:
                return (
                  <>
                    {/* Sticky Header */}
                    <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
                      <Heading className="text-center" level={6}>
                        Add a staff
                      </Heading>
                    </div>
                    <StaffForm mode="create" onSuccess={handleSuccess} onClose={handleClose} />
                  </>
                )

              case 2:
                return (
                  <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
                    <Heading level={6}>Completed!</Heading>
                    <Text weight="light" size="base">
                      Farm Staff created successfully
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
