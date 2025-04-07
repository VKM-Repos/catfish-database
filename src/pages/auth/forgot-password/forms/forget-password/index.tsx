import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { Loader } from 'src/components/ui/loader'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Please fill this field' }),
})
type ResetData = z.infer<typeof formSchema>

const useForgotPassword = createPostMutationHook({
  endpoint: '/auth/forgot-password',
  requestSchema: formSchema,
  responseSchema: z.object({ message: z.string() }),
  requiresAuth: false,
})

export default function ForgetPassword({ handleNext }: { handleNext: () => void }) {
  const { t } = useTranslation('translation')
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  const form = useForm<ResetData>({ resolver: zodResolver(formSchema) })
  const forgotPasswordMutation = useForgotPassword()

  const onSubmit = async (data: ResetData) => {
    try {
      setError(null)
      await forgotPasswordMutation.mutateAsync(data)
      handleNext()
    } catch (err) {
      console.error('Forgot password error:', err)
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

  return (
    <>
      <div className="mt-[2rem] flex flex-col items-center justify-center gap-4">
        <Heading level={6} weight="normal">
          Reset your password
        </Heading>
        <Text weight="light" size="base" align="center">
          Enter your email address, and we&apos;ll send you instructions to reset your password.
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {error && (
            <Alert variant="error" tone="filled">
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email address<span className="px-1 !text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    icon={
                      <SolarIconSet.Letter color={error ? '#EF4444' : 'currentColor'} size={20} iconStyle="Outline" />
                    }
                    iconPosition="right"
                    state={error ? 'error' : 'default'}
                    type="email"
                    placeholder="Enter email address"
                    disabled={forgotPasswordMutation.isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={form.formState.isValid ? 'primary' : 'ghost'}
            className="my-4 flex gap-2 focus:outline-none"
            disabled={!form.formState.isValid || forgotPasswordMutation.isLoading}
          >
            {forgotPasswordMutation.isLoading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text>Sending...</Text>
              </>
            ) : (
              <Text>Reset password</Text>
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
