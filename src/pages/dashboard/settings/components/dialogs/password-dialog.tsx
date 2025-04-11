import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import { Dialog, DialogTrigger, DialogContent } from 'src/components/ui/dialog'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { createPatchMutationHook } from 'src/api/hooks/usePatch'
import PasswordForm from '../forms/password-form'

const baseSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Must contain at least one uppercase letter',
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Must contain at least one lowercase letter',
    })
    .refine((value) => /\d/.test(value), {
      message: 'Must contain at least one number',
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>_+\-=/[\]\\/~`']/.test(value), {
      message: 'Must contain at least one symbol',
    }),
})

const formSchema = baseSchema
  .extend({
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type PasswordData = z.infer<typeof formSchema>

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  const updatePasswordMutation = createPatchMutationHook({
    endpoint: '/users/change-password',
    requestSchema: baseSchema,
    responseSchema: z.string(),
  })()

  const form = useForm<PasswordData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: PasswordData) => {
    try {
      setError(null)
      await updatePasswordMutation.mutateAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      setStep(2)
    } catch (err) {
      console.error('Error updating password:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error: string; message: string } } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
          })
        }
      }
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PasswordForm form={form} onSubmit={onSubmit} error={error} setOpen={setOpen} title="Change password" />
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg">Password changed successfully!</Text>
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
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="max-h-fit w-full overflow-hidden px-8 py-4">{renderStep()}</DialogContent>
    </Dialog>
  )
}
