import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { userResponseSchema } from 'src/schemas/schemas'
import { UsersForm } from '../../components/forms/users-form.tsx'

const useGetUserDetails = createGetQueryHook<typeof userResponseSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: userResponseSchema,
  queryKey: ['user'],
})

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading } = useGetUserDetails({ route: { id: id! } })
  const [step, setStep] = useState(1)

  if (!id) {
    return null
  }

  const RenderSteps = ({ user }: any) => {
    switch (step) {
      case 1:
        return (
          <UsersForm
            mode="edit"
            initialValues={{
              id: user?.id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              phone: user?.phone,
              clusterId: user?.cluster?.id ?? '',
              role: user?.role,
            }}
            onSuccess={handleSuccess}
            onClose={handleClose}
          />
        )
      case 2:
        return (
          <div className="mx-auto flex h-auto w-[360px] flex-col items-center justify-center space-y-2 p-8">
            <Heading level={6}>Completed!</Heading>
            <Text weight="light" size="base">
              User updated successfully!
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
        className="h-fit max-h-[90dvh] w-full max-w-[550px] overflow-y-scroll"
      >
        {isLoading ? (
          <div className="flex w-fit justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : user ? (
          <RenderSteps user={user} />
        ) : (
          <div>User not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
