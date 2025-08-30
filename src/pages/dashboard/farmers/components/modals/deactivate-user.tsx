import { Dialog, DialogClose, DialogContent, DialogHeader } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { X } from 'lucide-react'
import ECLIPSE from 'src/assets/images/ellipse.png'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { useState } from 'react'
import { User } from 'src/types'
import { createPutMutationHook } from 'src/api/hooks/usePut'

const DEACTIVATE_DAYS = 12

type DeactivateUserDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateUserDialog({ user, open, onOpenChange }: DeactivateUserDialogProps) {
  const queryClient = useQueryClient()

  const [isActive, setIsActive] = useState(user?.accountNonLocked)
  const [step, setStep] = useState(1)

  // Create the put mutation hook for deactivating a user.
  const useDeactivateUser = createPutMutationHook({
    endpoint: `/admin/users/${user.id}/ban?days=${DEACTIVATE_DAYS}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  // Create the put mutation hook for activating a user.
  const useActivateUser = createPutMutationHook({
    endpoint: `/admin/users/${user.id}/unban`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  const { mutate: deactivateUser, isLoading: isDeactivating } = useDeactivateUser()
  const { mutate: activateUser, isLoading: isActivating } = useActivateUser()

  const handleCloseDialog = () => {
    setStep(1)
    onOpenChange(false)
  }
  const handleToggle = () => {
    if (user?.accountNonLocked) {
      // Deactivate the user
      deactivateUser(
        {},
        {
          onSuccess: () => {
            setStep(2)
            setIsActive(false)
            queryClient.invalidateQueries(['farmers'])
          },
        },
      )
    } else {
      // Activate the user
      activateUser(
        {},
        {
          onSuccess: () => {
            setStep(2)
            setIsActive(true)
            queryClient.invalidateQueries(['farmers'])
          },
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-8">
        {step === 1 && (
          <>
            <picture>
              <img className="absolute left-0 top-0 w-[10rem]" src={ECLIPSE} alt="Background ellipse" />
            </picture>
            <DialogClose className="flex h-16 w-full items-center justify-end">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogHeader>
              <Heading level={5}>{!user?.accountNonLocked ? 'Deactivate Farmer?' : 'Activate Farmer?'}</Heading>
            </DialogHeader>
            <div className="space-y-8">
              <Text weight="light" size="base">
                {user?.accountNonLocked
                  ? `You are about to deactivate this Farmer, "${user.firstName}". This action cannot be undone.`
                  : `You are about to activate this Farmer, "${user.firstName}".`}
              </Text>
              <div className="flex w-full justify-between space-x-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeactivating || isActivating}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={handleToggle}
                  disabled={isDeactivating || isActivating}
                >
                  {isDeactivating || isActivating
                    ? 'Processing...'
                    : user?.accountNonLocked
                    ? 'Deactivate'
                    : 'Activate'}
                </Button>
              </div>
            </div>
          </>
        )}

        {step == 2 && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Text className="text-lg font-semibold">Done!</Text>

            <Text weight="light">Farmer {user?.accountNonLocked ? 'Activated' : 'Deactivated'} successfully</Text>
            <Button variant="primary" onClick={handleCloseDialog}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
