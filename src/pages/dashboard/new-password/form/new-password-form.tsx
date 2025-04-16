import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { Loader } from 'src/components/ui/loader'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { changePasswordSchema, userSchema } from 'src/schemas'
import { createPatchMutationHook } from 'src/api/hooks/usePatch'
import { useAuthStore } from 'src/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { createGetQueryHook } from 'src/api/hooks/useGet'

const formSchema = changePasswordSchema

type PasswordData = z.infer<typeof formSchema>

const useChangePassword = createPatchMutationHook({
  endpoint: '/users/change-password',
  requestSchema: formSchema,
  responseSchema: z.any(),
  requiresAuth: true,
})

export const useGetCurrentUser = createGetQueryHook({
  endpoint: '/users/me',
  responseSchema: userSchema,
  queryKey: ['user'],
  requiresAuth: true,
})

export default function NewPasswordForm({ handleNext }: { handleNext: () => void }) {
  const [error, setError] = useState<ClientErrorType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<PasswordData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })
  const changePasswordMutation = useChangePassword()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const { data: current_user } = useGetCurrentUser()

  const onSubmit = async (data: PasswordData) => {
    try {
      setError(null)
      useAuthStore.getState().commitUpdateUser({ defaultPassword: false })

      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      await queryClient.invalidateQueries(['user'])

      const updatedUser = queryClient.getQueryData(['user'])

      if (updatedUser) {
        useAuthStore.getState().setUser(current_user ?? null)
      }

      handleNext()
    } catch (err) {
      console.error('Change password error:', err)
      useAuthStore.getState().rollbackUpdateUser()
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
    <div className="mx-auto mt-[8rem] h-full w-full max-w-lg">
      <div className=" flex flex-col items-center justify-center gap-4">
        <Heading level={5} weight="semibold">
          Create new password
        </Heading>
        <Text weight="light" size="base" align="center" className="w-2/3">
          You’re logging in for the first time. Please create a new password to continue
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {error && <FormValidationErrorAlert error={error} />}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Old password<span className="px-1 !text-error-500">*</span>
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
                    state={error || fieldState.error ? 'error' : 'default'}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your old password"
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
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  New password<span className="px-1 !text-error-500">*</span>
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
                    state={error || fieldState.error ? 'error' : 'default'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Your new password"
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
                <Text>Updating...</Text>
              </>
            ) : (
              <Text>Update password</Text>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
