import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { useAuthStore } from 'src/store/auth.store'
import { Card, CardHeader, CardContent, CardFooter } from 'src/components/ui/card'
import { Container } from 'src/components/ui/container'
import { Logo } from 'src/components/ui/logo'
import { Heading } from 'src/components/ui/heading'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { Checkbox } from 'src/components/ui/checkbox'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { authCache } from 'src/api/config'
import { Loader } from 'src/components/ui/loader'
import { ClientErrorType, ServerErrorType, UserRole } from 'src/types'
import { loginRequestSchema, loginResponseSchema } from 'src/schemas/schemas'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'

const useLogin = createPostMutationHook({
  endpoint: '/auth/login',
  requestSchema: loginRequestSchema,
  responseSchema: loginResponseSchema,
  requiresAuth: false,
})

type FormValues = z.infer<typeof loginRequestSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<ClientErrorType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const login = useAuthStore((state) => state.login)

  const form = useForm<FormValues>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  const loginMutation = useLogin()

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null)

      // Call the login API
      const response = await loginMutation.mutateAsync(values)

      // Extract data from response
      const { userDto, accessToken, refreshToken, expiresAt } = response

      // Update auth cache
      authCache.setToken(accessToken)
      authCache.setRefreshToken(refreshToken)
      authCache.setExpiresAt(expiresAt)
      authCache.setUser(userDto)

      // Update auth store
      login(userDto, accessToken, refreshToken, expiresAt)

      if (userDto.role === UserRole.FARMER) {
        navigate(paths.dashboard.home.getStarted)
      } else {
        navigate(paths.dashboard.root)
      }
    } catch (err) {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container className="w-fit overflow-hidden">
      <Card className="mx-auto flex min-h-[517px] w-[480px] flex-col gap-2 bg-white p-2 leading-tight tracking-wide lg:min-w-[470px]">
        <CardHeader className="flex flex-col items-center justify-center gap-y-8">
          <div className="flex flex-col items-center justify-center">
            <Logo className="text-primary h-[50px] w-[55px] p-1" />
            <Heading level={5} className="font-semibold text-primary-500">
              Catfish Database
            </Heading>
          </div>
          <Heading level={6} weight="normal">
            Log in to access your account
          </Heading>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              {error && <FormValidationErrorAlert error={error} />}
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>
                      Email address<span className="px-1 !text-error-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        icon={
                          <SolarIconSet.Letter
                            color={error ? '#EF4444' : 'currentColor'}
                            size={20}
                            iconStyle="Outline"
                          />
                        }
                        iconPosition="right"
                        state={error ? 'error' : 'default'}
                        type="email"
                        placeholder="Enter email address"
                        disabled={loginMutation.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="px-1 !text-error-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        icon={
                          <Button
                            variant="ghost"
                            onClick={togglePasswordVisibility}
                            type="button"
                            className="h-full w-full p-0"
                            disabled={loginMutation.isLoading}
                          >
                            {showPassword ? (
                              <SolarIconSet.EyeClosed
                                color={error ? '#EF4444' : 'currentColor'}
                                size={20}
                                iconStyle="Outline"
                              />
                            ) : (
                              <SolarIconSet.Eye
                                color={error ? '#EF4444' : 'currentColor'}
                                size={20}
                                iconStyle="Outline"
                              />
                            )}
                          </Button>
                        }
                        iconPosition="right"
                        state={error ? 'error' : 'default'}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        disabled={loginMutation.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" disabled={loginMutation.isLoading} />
                  <Text variant="label" size="base" weight="normal" color="text-neutral-400">
                    Remember me
                  </Text>
                </div>
                <Link to={paths.auth.forgotPassword} className="text-sm font-semibold text-primary-500 underline">
                  Forgot password
                </Link>
              </div>
              <Button
                type="submit"
                variant={'primary'}
                className="my-4 flex items-center justify-center gap-2 focus:outline-none"
                disabled={!form.formState.isValid || loginMutation.isLoading}
              >
                {loginMutation.isLoading ? (
                  <>
                    <Loader type="spinner" size={18} />
                    <Text color="text-inherit" variant="body">
                      Logging in...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="text-inherit" variant="body">
                      Log in
                    </Text>
                    <SolarIconSet.ArrowRight color="currentColor" size={18} iconStyle="Outline" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex h-[56px] flex-col items-center justify-center rounded-lg bg-neutral-100">
          <span className="mt-4 text-sm text-neutral-400">
            Powered by
            <a href="https://www.fao.org/fish4acp" className="ml-2 font-semibold text-info-500 underline">
              FISH4ACP
            </a>
          </span>
        </CardFooter>
      </Card>
    </Container>
  )
}
