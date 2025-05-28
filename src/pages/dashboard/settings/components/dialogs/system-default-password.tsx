import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PasswordForm from '../forms/password-form'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { changePasswordSchema } from 'src/schemas'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { createGetQueryHook } from 'src/api/hooks/useGet'

type UpdateConfigBody = {
  value: string
  description?: string
}

export default function ChangeSystemPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<ClientErrorType | null>(null)

  const useGetSystemConfiguration = createGetQueryHook({
    endpoint: `configurations?key=DEFAULT_PASSWORD`,
    responseSchema: z.any(),
    queryKey: ['system-configuration'],
  })
  const { data: config, isLoading } = useGetSystemConfiguration()

  const configItem = config?.content?.[0]
  const configId = configItem?.id
  const configDescription = configItem?.description
  const configCurrentPassword = configItem?.value

  const formSchema = changePasswordSchema
    .extend({
      confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
      currentPassword: z.string().min(1, { message: 'Please enter your current password' }),
    })
    .refine((data) => !configCurrentPassword || data.currentPassword === configCurrentPassword, {
      message: 'Current password is incorrect',
      path: ['currentPassword'],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    })

  type PasswordData = z.infer<typeof formSchema>

  const form = useForm<PasswordData>({ resolver: zodResolver(formSchema) })

  const changeDefaultPasswordMutation = createPutMutationHook({
    endpoint: configId ? `configurations/${configId}` : '',
    requestSchema: z.object({ value: z.string(), description: z.string().optional() }),
    responseSchema: z.any(),
  })()

  const onSubmit = async (data: PasswordData) => {
    if (!configId) {
      setError({ title: 'Error', message: 'Configuration not loaded', errors: [] })
      return
    }
    try {
      setError(null)
      const body: UpdateConfigBody = {
        value: data.newPassword,
        description: configDescription,
      }
      await changeDefaultPasswordMutation.mutateAsync(body)
      setStep(2)
    } catch (err) {
      console.error('Error updating password:', err)
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PasswordForm
            form={form}
            onSubmit={onSubmit}
            error={error}
            setOpen={setOpen}
            title="Change default password"
            loading={isLoading || changeDefaultPasswordMutation.isLoading}
          />
        )
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg">System default password changed successfully!</Text>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false)
                setStep(1)
                form.reset()
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change default password</Button>
      </DialogTrigger>
      <DialogContent className="max-h-fit w-full overflow-hidden px-8 py-4">{renderStep()}</DialogContent>
    </Dialog>
  )
}
