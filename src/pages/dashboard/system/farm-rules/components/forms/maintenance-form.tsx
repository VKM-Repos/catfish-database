import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'

import * as SolarIconSet from 'solar-icon-set'
import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'
import { farmerRequestSchema, extendedFarmerRequestSchema } from 'src/schemas/schemas'
import { useEffect, useState } from 'react'
import { useAuthStore } from 'src/store/auth.store'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { ClientErrorType, ServerErrorType } from 'src/types'

type FarmerValues = z.infer<typeof farmerRequestSchema> & { id?: string }

type FarmerProps = {
  mode: 'create' | 'edit'
  initialValues?: FarmerValues
  onSuccess?: () => void
  onClose?: () => void
}

export function MaintenanceForm({ mode, initialValues, onSuccess, onClose }: FarmerProps) {
  // const queryClient = useQueryClient()
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
  // const useCreateMaintenance = createPostMutationHook({
  //   endpoint: '/users/users',
  //   requestSchema: farmerRequestSchema,
  //   responseSchema: farmerResponseSchema,
  // })

  // // Create the update cluster mutation hook
  // const useUpdateMaintenance = createPutMutationHook({
  //   endpoint: `/users/${initialValues?.id}`,
  //   requestSchema: farmerRequestSchema,
  //   responseSchema: farmerResponseSchema,
  // })

  // const createMaintenanceMutation = useCreateMaintenance()
  // const updateMaintenanceMutation = useUpdateMaintenance()

  const onSubmit = async (values: FarmerValues) => {
    console.log(values)
    try {
      setError(null)
      if (mode === 'create') {
        // user?.role === 'SUPER_ADMIN'
        //   ? await createFarmerMutation.mutateAsync({ ...values, role: 'FARMER' })
        //   : await clusterManagerCreateFarmer.mutateAsync({ ...values })
        // queryClient.invalidateQueries(['farmers'])
        // queryClient.refetchQueries(['farmer-details'])
      } else if (mode === 'edit' && initialValues?.id) {
        // await updateFarmerMutation.mutateAsync({
        //   ...values,
        //   id: initialValues.id,
        //   role: 'FARMER',
        // })
        // queryClient.invalidateQueries(['farmers'])
        // queryClient.refetchQueries(['farmer-details'])
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
          {mode === 'create' ? 'Add Maintenance Types' : ' Edit feed type'}
        </Heading>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && <FormValidationErrorAlert error={error} />}
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Maintenance Task name <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter Task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Description <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              {/* {createFarmerMutation.isLoading ||
              updateFarmerMutation.isLoading ||
              clusterManagerCreateFarmer.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
                </>
              ) : ( */}
              <>
                <Text>{mode === 'create' ? 'Save' : 'Update'}</Text>
              </>
              {/* )} */}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
