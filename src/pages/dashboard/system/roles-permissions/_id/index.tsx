import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { RoleForm } from '../components/forms/role-form'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Heading } from 'src/components/ui/heading'

export default function EditRolePage() {
  const location = useLocation()
  const { role } = location?.state || {}
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.system.rolesPermission.root)
  }

  return (
    <Dialog open>
      <DialogContent
        className={`max-h-[80vh] max-w-[600px] overflow-hidden ${step === 1 ? 'overflow-y-scroll' : null} p-8`}
      >
        <div className={`pt-[4rem] pb-${step === 1 ? '1' : '[2rem]'}`}>
          {(() => {
            switch (step) {
              case 1:
                return <RoleForm mode="edit" onSuccess={handleSuccess} onClose={handleClose} initialValues={role} />

              case 2:
                return (
                  <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
                    <Heading level={6}>Completed!</Heading>
                    <Text weight="light" size="base">
                      Your role and permission settings have been saved
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
