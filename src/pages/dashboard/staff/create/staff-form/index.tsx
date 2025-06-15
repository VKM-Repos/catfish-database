import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'

import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'
import { farmerRequestSchema, extendedFarmerRequestSchema } from 'src/schemas/schemas'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Grid } from 'src/components/ui/grid'
import { Textarea } from 'src/components/ui/textarea'
import { useAuthStore } from 'src/store/auth.store'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { ClientErrorType } from 'src/types'
import { Checkbox } from 'src/components/ui/checkbox'

type FarmerValues = z.infer<typeof farmerRequestSchema> & { id?: string }

type FarmerProps = {
  mode: 'create' | 'edit'
  initialValues?: FarmerValues
  onSuccess?: () => void
  onClose?: () => void
}

export function StaffForm({ mode, initialValues, onSuccess, onClose }: FarmerProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<ClientErrorType | null>(null)
  const user = useAuthStore((state) => state.user)
  const [schema, setSchema] = useState(() => extendedFarmerRequestSchema(user))
  useEffect(() => {
    setSchema(extendedFarmerRequestSchema(user))
  }, [user])
  const form = useForm<FarmerValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {},
    mode: 'onChange',
  })

  // Create the create cluster mutation hook
  // const useCreateFarmer = createPostMutationHook({
  //   endpoint: '/users/users',
  //   requestSchema: farmerRequestSchema,
  //   responseSchema: farmerResponseSchema,
  // })

  // const useClusterManagerCreateFarmer = createPostMutationHook({
  //   endpoint: '/users/farmers',
  //   requestSchema: farmerRequestSchema,
  //   responseSchema: farmerResponseSchema,
  // })

  // Create the update cluster mutation hook
  // const useUpdateFarmer = createPutMutationHook({
  //   endpoint: `/users/${initialValues?.id}`,
  //   requestSchema: farmerRequestSchema,
  //   responseSchema: farmerResponseSchema,
  // })

  // const createFarmerMutation = useCreateFarmer()
  // const clusterManagerCreateFarmer = useClusterManagerCreateFarmer()
  // const updateFarmerMutation = useUpdateFarmer()

  // const useGetClusters = createGetQueryHook({
  //   endpoint: '/clusters',
  //   responseSchema: z.any(),
  //   queryKey: ['clusters_for_farmers  '],
  //   options: {
  //     enabled: user?.role === 'SUPER_ADMIN',
  //   },
  // })

  // const { data: clusters, isLoading: isLoadingClusters } = useGetClusters()

  const onSubmit = async (values: FarmerValues) => {
    console.log(values)
    // try {
    //   setError(null)
    //   if (mode === 'create') {
    //     user?.role === 'SUPER_ADMIN'
    //       ? await createFarmerMutation.mutateAsync({ ...values, role: 'FARMER' })
    //       : await clusterManagerCreateFarmer.mutateAsync({ ...values })
    //     queryClient.invalidateQueries(['farmers'])
    //     queryClient.refetchQueries(['farmer-details'])
    //   } else if (mode === 'edit' && initialValues?.id) {
    //     await updateFarmerMutation.mutateAsync({
    //       ...values,
    //       id: initialValues.id,
    //       role: 'FARMER',
    //     })
    //     queryClient.invalidateQueries(['farmers'])
    //     queryClient.refetchQueries(['farmer-details'])
    //   }

    //   form.reset()
    //   onSuccess?.()
    // } catch (err) {
    //   console.error(`${mode === 'create' ? 'Create' : 'Update'} cluster error:`, err)
    //   if (err && typeof err === 'object' && 'response' in err) {
    //     const axiosError = err as { response?: { data?: ServerErrorType } }
    //     const errorData = axiosError.response?.data

    //     if (errorData) {
    //       setError({
    //         title: errorData.error,
    //         message: errorData.message,
    //         errors: errorData.errors ?? null,
    //       })
    //     }
    //   }
    // }
  }

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 w-full border-b border-neutral-200 bg-white py-3">
        <Heading className="text-center" level={6}>
          {mode === 'create' ? 'Add a staff' : 'Edit farmer’s info'}
        </Heading>
      </div>

      {/* Scrollable Form Body */}
      <div className="relative h-[calc(100vh-7rem)] overflow-y-auto px-4 pb-36 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {error && <FormValidationErrorAlert error={error} />}

            {/* Name Fields */}
            <Grid cols={2} gap="gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </Grid>

            {/* Email */}
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

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      state={fieldState.error ? 'error' : 'default'}
                      placeholder="Address"
                      {...field}
                      className="text-neutral-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password & Generate */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input state={fieldState.error ? 'error' : 'default'} placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!form.formState.isValid}
                  className="whitespace-nowrap"
                >
                  <Text>Generate</Text>
                </Button>
              </div>

              {/* Send email to user */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Text>Send email to user</Text>
                  <span className="block text-xs text-neutral-500">Notify the user of their staff account</span>
                </div>
                <Checkbox />
              </div>
            </div>

            {/* Permissions */}
            <Heading level={6}>Set staff permission</Heading>
            <Grid cols={2} gap="gap-4">
              <Text>Daily Farm Report Entry</Text>
              <Checkbox />
              <Text>Sampling Report</Text>
              <Checkbox />
              <Text>Harvest Report</Text>
              <Checkbox />
              <Text>Feed Inventory</Text>
              <Checkbox />
              <Text>Maintenance Inventory</Text>
              <Checkbox />
              <Text>Sales Report</Text>
              <Checkbox />
              <Text>View Reports</Text>
              <Checkbox />
              <Text>Read-Only Access</Text>
            </Grid>
          </form>
        </Form>
      </div>

      {/* Sticky Footer */}
      {/* <div className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white px-4 py-3"> */}
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="your-form-id" // Optional: if you're using multi-form setup
          variant="primary"
          disabled={!form.formState.isValid}
        >
          <Text>{mode === 'create' ? 'Add staff' : 'Update'}</Text>
        </Button>
      </div>
      {/* </div> */}
    </>
  )
}
