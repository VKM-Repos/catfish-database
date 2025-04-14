import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Dialog, DialogTrigger, DialogContent } from 'src/components/ui/dialog'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from 'src/components/ui/button'
import { ClientErrorType, ServerErrorType, User } from 'src/types'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Heading } from 'src/components/ui/heading'
import { createPatchMutationHook } from 'src/api/hooks/usePatch'
import ProfileForm from '../forms/profile-form'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Please fill this field' }),
  lastName: z.string().min(1, { message: 'Please fill this field' }),
  phone: z.string().min(1, { message: 'Please fill this field' }),
  address: z.string().min(1, { message: 'Please fill this field' }),
})

type ProfileData = z.infer<typeof formSchema>

type ProfileDialogProps = {
  user: User
}

export default function ProfileDialog({ user }: ProfileDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<ClientErrorType | null>(null)

  const useGetStates = createGetQueryHook({
    endpoint: '/states',
    responseSchema: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    queryKey: ['states'],
  })

  const useUpdateUser = (userId: string) => {
    return createPatchMutationHook({
      endpoint: `/users/update-profile`,
      requestSchema: formSchema,
      responseSchema: z.string(),
    })()
  }

  const updateUserMutation = useUpdateUser(user.id)
  const { data: states = [], isLoading: isLoadingStates } = useGetStates()

  const form = useForm<ProfileData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
    },
  })
  const {
    reset,
    formState: { isDirty },
  } = form

  const onSubmit = async (data: ProfileData) => {
    try {
      setError(null)
      await updateUserMutation.mutateAsync(data)
      queryClient.invalidateQueries(['user'])
      setStep(2)
    } catch (err) {
      console.error('Error updating user:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
            errors: errorData?.errors,
          })
        }
      }
    }
  }

  const handleClose = async () => {
    setOpen(false)
    setStep(1)
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    })
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProfileForm
            form={form}
            onSubmit={onSubmit}
            error={error}
            setOpen={setOpen}
            loading={updateUserMutation.isLoading}
          />
        )
      case 2:
        return (
          <div className="my-4 flex w-full flex-col items-center justify-center gap-4">
            <Heading level={6}>Completed!</Heading>
            <Text weight="light" size="base">
              Profile updated successfully!
            </Text>
            <Button variant="primary" onClick={handleClose}>
              Continue
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary-400">
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Edit</Text>
          </FlexBox>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-fit w-full overflow-hidden px-8 py-4">{renderStep()}</DialogContent>
    </Dialog>
  )
}
