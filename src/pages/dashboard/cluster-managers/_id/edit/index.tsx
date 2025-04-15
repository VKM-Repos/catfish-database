import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { ClusterManagerForm } from '../../components/forms/cluster-manager-form'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { useState } from 'react'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { userSchema } from 'src/schemas/schemas'

const useGetClusterManager = createGetQueryHook<typeof userSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: userSchema,
  queryKey: ['user'],
})

export default function EditClusterManagerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: cluster_manager, isLoading, isError, error } = useGetClusterManager({ route: { id: id! } })
  const [step, setStep] = useState(1)

  if (!id) {
    return null
  }

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(paths.dashboard.clusterManagers.root)
  }

  // Ensure clusterId is included in the initial values
  const initialValues = {
    id: cluster_manager?.id || '',
    email: cluster_manager?.email || '',
    firstName: cluster_manager?.firstName || '',
    lastName: cluster_manager?.lastName || '',
    phone: cluster_manager?.phone || '',
    clusterId: cluster_manager?.cluster?.id || '',
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.clusterManagers.root)}>
      <DialogContent className="max-w-[478px] overflow-hidden p-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : cluster_manager ? (
          <div className="py-[4rem] pb-[6rem]">
            {step === 1 && (
              <ClusterManagerForm
                mode="edit"
                initialValues={initialValues}
                onSuccess={handleSuccess}
                onClose={handleClose}
              />
            )}
            {step === 2 && (
              <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
                <Heading level={6}>Completed!</Heading>
                <Text weight="light" size="base">
                  Cluster Manager updated successfully!
                </Text>
                <Button variant="primary" onClick={handleClose}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        ) : isError ? (
          <div>Error gettiing user</div>
        ) : (
          <div>User not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
