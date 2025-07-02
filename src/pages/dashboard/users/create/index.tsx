import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Dialog, DialogContent } from 'src/components/ui/dialog'

import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Heading } from 'src/components/ui/heading'
import { UsersForm } from '../components/forms/users-form.tsx'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <UsersForm mode="create" onSuccess={handleSuccess} onClose={handleClose} />
      case 2:
        return (
          <div className="mx-auto flex h-auto w-[360px] flex-col items-center justify-center space-y-2 p-8">
            <Heading level={6}>Completed!</Heading>
            <Text weight="light" size="base">
              User created successfully!
            </Text>
            <div className="pt-8">
              {' '}
              <Button variant="primary" onClick={handleClose} className="m">
                Continue
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.users.root)
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="h-fit max-h-[90dvh] w-fit max-w-[550px] overflow-y-scroll"
      >
        <RenderSteps />
      </DialogContent>
    </Dialog>
  )
}
