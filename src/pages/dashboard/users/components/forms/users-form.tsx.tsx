import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { Loader } from 'src/components/ui/loader'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { createPutMutationHook } from 'src/api/hooks/usePut'

import { z } from 'zod'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from 'src/components/ui/select'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Heading } from 'src/components/ui/heading'
import { userRequestSchema, userResponseSchema } from 'src/schemas/schemas'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Grid } from 'src/components/ui/grid'
import { Cluster } from 'src/types/cluster.types'
import { FlexBox } from 'src/components/ui/flexbox'
import { formatLabel } from 'src/lib/utils'
import { _ROLES } from 'src/lib/constants'

type UserFormValues = z.infer<typeof userRequestSchema> & { id?: string }

type UserFormProps = {
  mode: 'create' | 'edit'
  initialValues?: UserFormValues
  onSuccess?: () => void
  onClose?: () => void
}

export function UsersForm({ mode, initialValues, onSuccess, onClose }: UserFormProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<ClientErrorType | null>(null)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userRequestSchema),
    defaultValues: initialValues || {},
    mode: 'onChange',
  })

  // Create the create cluster mutation hook
  const useCreateUser = createPostMutationHook({
    endpoint: '/users/users',
    requestSchema: userRequestSchema,
    responseSchema: userResponseSchema,
  })

  // Create the update cluster mutation hook
  const useUpdateUser = createPutMutationHook({
    endpoint: `/users/${initialValues?.id}`,
    requestSchema: userRequestSchema,
    responseSchema: userResponseSchema,
  })

  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.any(),
    queryKey: ['clusters'],
  })
  const useGetRoles = createGetQueryHook({
    endpoint: '/roles',
    responseSchema: z.any(),
    queryKey: ['roles'],
  })

  const { data: clusters, isLoading: isLoadingClusters } = useGetClusters()
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles()

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const onSubmit = async (values: UserFormValues) => {
    try {
      setError(null)
      const requestBody = {
        email: values.email,
        role: values.role?.toUpperCase().replace(/\s+/g, '_'), // Capitalize and replace spaces with underscores
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        // address: '123b Baker Str.',
        clusterId: String(values.clusterId),
      }

      console.log('Submitting request body:', requestBody) // Debug log

      if (mode === 'create') {
        await createUserMutation.mutateAsync(requestBody)
        queryClient.invalidateQueries(['users'])
      } else if (mode === 'edit' && initialValues?.id) {
        await updateUserMutation.mutateAsync({ ...requestBody, id: initialValues.id })
        queryClient.invalidateQueries(['users'])
      }
      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} cluster error:`, err)
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
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          {mode === 'create' ? 'Add a new user' : 'Edit user'}
        </Heading>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="my-12 flex min-w-[490px] flex-col justify-start gap-4 p-8"
        >
          {error && <FormValidationErrorAlert error={error} />}
          <Grid cols={2} gap="gap-4">
            <div className="flex w-full flex-col gap-1">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                First Name
                <span className="font-bold text-red-500">*</span>
                {/* <SolarIconSet.QuestionCircle size={16} /> */}
              </Text>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          state={fieldState.error ? 'error' : 'default'}
                          placeholder="Enter first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Last Name
                <span className="font-bold text-red-500">*</span>
                {/* <SolarIconSet.QuestionCircle size={16} /> */}
              </Text>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Grid>
          <div className="flex w-full flex-1 flex-col gap-1">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Email
              <span className="font-bold text-red-500">*</span>
              {/* <SolarIconSet.QuestionCircle size={16} /> */}
            </Text>
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      state={fieldState.error ? 'error' : 'default'}
                      placeholder="Enter email"
                      {...field}
                      disabled={mode === 'edit'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Phone Number
              <span className="font-bold text-red-500">*</span>
              {/* <SolarIconSet.QuestionCircle size={16} /> */}
            </Text>
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter phone " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Grid cols={2} gap="gap-4">
            <div className="flex w-full flex-col gap-1">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Role
                <span className="font-bold text-red-500">*</span>
                {/* <SolarIconSet.QuestionCircle size={16} /> */}
              </Text>
              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(value)}
                        // state={fieldState.error ? 'error' : 'default'}
                        disabled={mode === 'edit'}
                      >
                        <SelectTrigger className={`${fieldState.error ? 'border-error-500' : ''} font-light`}>
                          <SelectValue placeholder="Roles" />
                        </SelectTrigger>
                        <SelectContent className="z-[2000]">
                          {isLoadingRoles ? (
                            <SelectItem value="loading" disabled>
                              <Text>Loading roles...</Text>
                            </SelectItem>
                          ) : (
                            _ROLES?.map((role: any) => (
                              <SelectItem key={role} value={String(role)}>
                                {formatLabel(role)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full flex-col gap-1">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Cluster
                <span className="font-bold text-red-500">*</span>
                {/* <SolarIconSet.QuestionCircle size={16} /> */}
              </Text>
              <FormField
                control={form.control}
                name="clusterId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(value)}
                        // state={fieldState.error ? 'error' : 'default'}
                      >
                        <SelectTrigger className={`${fieldState.error ? 'border-error-500' : ''} font-light`}>
                          <SelectValue placeholder="Cluster" />
                        </SelectTrigger>
                        <SelectContent className="z-[2000]">
                          {isLoadingClusters ? (
                            <SelectItem value="loading" disabled>
                              <Text>Loading clusters...</Text>
                            </SelectItem>
                          ) : (
                            clusters?.map((cluster: Cluster) => (
                              <SelectItem key={cluster.id} value={String(cluster.id)}>
                                {cluster.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Grid>
        </form>
      </Form>
      <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          variant="primary"
          className="flex items-center gap-2"
          disabled={!form.formState.isValid || createUserMutation.isLoading || updateUserMutation.isLoading}
        >
          {createUserMutation.isLoading || updateUserMutation.isLoading ? (
            <>
              <Loader type="spinner" size={18} />
              <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
            </>
          ) : (
            <>
              <Text>{mode === 'create' ? 'Add user' : 'Update user'}</Text>
            </>
          )}
        </Button>
      </FlexBox>
    </>
  )
}
