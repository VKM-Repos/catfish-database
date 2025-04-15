import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { useLocation } from 'react-router-dom'
import { Loader } from 'src/components/ui/loader'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { passwordSchema } from 'src/schemas'

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordData = z.infer<typeof formSchema>

const requestSchema = z.object({
  password: passwordSchema,
  token: z.string(),
})

const useChangePassword = createPostMutationHook({
  endpoint: '/auth/reset-password',
  requestSchema: requestSchema,
  responseSchema: z.object({ message: z.string() }),
  requiresAuth: false,
})

export default function ChoosePassword({ handleNext }: { handleNext: () => void }) {
  const { t } = useTranslation('translation')
  const [error, setError] = useState<ClientErrorType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  })
  const changePasswordMutation = useChangePassword()
  const location = useLocation()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: PasswordData) => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (!token) {
      setError({ title: 'Error', message: 'Token is missing from the URL.', errors: [''] })
      return
    }

    try {
      setError(null)
      await changePasswordMutation.mutateAsync({ password: data.password, token: encodeURIComponent(token) })
      handleNext()
    } catch (err) {
      console.error('Change password error:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
            errors: errorData.errors ?? null,
          })
        }
      }
    }
  }

  return (
    <>
      <div className="mt-[2rem] flex flex-col items-center justify-center gap-4">
        <Heading level={6} weight="normal">
          Choose a new password
        </Heading>
        <Text weight="light" size="base" align="center">
          Your new password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {error && <FormValidationErrorAlert error={error} />}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New password<span className="px-1 !text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    icon={
                      <Button
                        variant="ghost"
                        onClick={togglePasswordVisibility}
                        type="button"
                        className="h-full w-full p-0"
                        disabled={changePasswordMutation.isLoading}
                      >
                        {showPassword ? (
                          <SolarIconSet.EyeClosed
                            color={error ? '#EF4444' : 'currentColor'}
                            size={20}
                            iconStyle="Outline"
                          />
                        ) : (
                          <SolarIconSet.Eye color={error ? '#EF4444' : 'currentColor'} size={20} iconStyle="Outline" />
                        )}
                      </Button>
                    }
                    iconPosition="right"
                    state={error ? 'error' : 'default'}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={changePasswordMutation.isLoading}
                    {...field}
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
                <FormLabel>
                  Confirm new password<span className="px-1 !text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    icon={
                      <Button
                        variant="ghost"
                        onClick={toggleConfirmPasswordVisibility}
                        type="button"
                        className="h-full w-full p-0"
                        disabled={changePasswordMutation.isLoading}
                      >
                        {showConfirmPassword ? (
                          <SolarIconSet.EyeClosed
                            color={error ? '#EF4444' : 'currentColor'}
                            size={20}
                            iconStyle="Outline"
                          />
                        ) : (
                          <SolarIconSet.Eye color={error ? '#EF4444' : 'currentColor'} size={20} iconStyle="Outline" />
                        )}
                      </Button>
                    }
                    iconPosition="right"
                    state={error ? 'error' : 'default'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    disabled={changePasswordMutation.isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={'primary'}
            className="my-4 flex gap-2 focus:outline-none"
            disabled={!form.formState.isValid || changePasswordMutation.isLoading}
          >
            {changePasswordMutation.isLoading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text>Changing...</Text>
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
