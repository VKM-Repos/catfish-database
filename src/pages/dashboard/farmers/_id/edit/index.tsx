import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { userSchema } from 'src/schemas/schemas'
import { FarmersForm } from '../../components/forms/farmers-form'

const useGetFarmer = createGetQueryHook<typeof userSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: userSchema,
  queryKey: ['cluster'],
})

export default function EditFarmerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: farmer, isLoading, isError, error } = useGetFarmer({ route: { id: id! } })
  const [step, setStep] = useState(1)

  if (!id) {
    return null
  }

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.farmers.root)
  }

  // Ensure clusterId is included in the initial values
  const initialValues = {
    id: farmer?.id || '',
    email: farmer?.email || '',
    firstName: farmer?.firstName || '',
    lastName: farmer?.lastName || '',
    phone: farmer?.phone || '',
    clusterId: farmer?.cluster?.id || '',
    address: farmer?.address || '',
    state: farmer?.cluster?.id || '',
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.farmers.root)}>
      <DialogContent className="max-w-[478px] overflow-hidden p-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : farmer ? (
          <div className="py-[4rem] pb-[6rem]">
            {step === 1 && (
              <FarmersForm mode="edit" initialValues={initialValues} onSuccess={handleSuccess} onClose={handleClose} />
            )}
            {step === 2 && (
              <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
                <Heading level={6}>Completed!</Heading>
                <Text weight="light" size="base">
                  Farmer updated successfully!
                </Text>
                <Button variant="primary" onClick={handleClose}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        ) : isError ? (
          <div>Error getting farmer</div>
        ) : (
          <div>Farmer not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
