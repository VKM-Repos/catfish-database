import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PasswordForm from '../forms/password-form'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'

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

export default function ChangeSystemPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  // const updateSystemPasswordMutation = createPatchMutationHook({
  //   endpoint: '/system/change-password',
  //   requestSchema: baseSchema,
  //   responseSchema: z.string(),
  // })()

  const form = useForm<PasswordData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: PasswordData) => {
    try {
      setError(null)
      console.log({ currentPassword: data.currentPassword, newPassword: data.newPassword })
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
        return (
          <PasswordForm
            form={form}
            onSubmit={onSubmit}
            error={error}
            setOpen={setOpen}
            title="Change default password"
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
