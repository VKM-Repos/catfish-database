import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import { Dialog, DialogTrigger, DialogContent } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { Heading } from 'src/components/ui/heading'
import * as SolarIconSet from 'solar-icon-set'

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updatePasswordMutation = createPutMutationHook({
    endpoint: '/api/users/change-password',
    requestSchema: baseSchema,
    responseSchema: z.object({}),
  })()

  const form = useForm<PasswordData>({ resolver: zodResolver(formSchema) })
  const {
    reset,
    formState: { isDirty },
  } = form

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

  const PasswordForm = () => (
    <>
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          Change Password
        </Heading>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <Alert variant="error" tone="filled">
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...field}
                    icon={
                      <Button
                        variant="ghost"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        type="button"
                        className="h-full w-full p-0"
                      >
                        {showCurrentPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                      </Button>
                    }
                    iconPosition="right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    {...field}
                    icon={
                      <Button
                        variant="ghost"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        type="button"
                        className="h-full w-full p-0"
                      >
                        {showNewPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                      </Button>
                    }
                    iconPosition="right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                    icon={
                      <Button
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        type="button"
                        className="h-full w-full p-0"
                      >
                        {showConfirmPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                      </Button>
                    }
                    iconPosition="right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isDirty}>
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[410px] overflow-hidden px-8 py-4">
        <div className="py-[4rem] pb-[6rem]">
          {step === 1 && <PasswordForm />}
          {step === 2 && (
            <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
              <Text>Password changed successfully!</Text>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
