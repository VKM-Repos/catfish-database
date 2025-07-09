import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'
import { staffRequestSchema, staffResponseSchema } from 'src/schemas/schemas'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Grid } from 'src/components/ui/grid'
import { Textarea } from 'src/components/ui/textarea'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { Checkbox } from 'src/components/ui/checkbox'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { FlexBox } from 'src/components/ui/flexbox'

type StaffValues = z.infer<typeof staffRequestSchema>

type StaffProps = {
  mode: 'create' | 'edit'
  initialValues?: StaffValues
  onSuccess?: () => void
  onClose?: () => void
}

export function StaffForm({ mode, initialValues, onSuccess, onClose }: StaffProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<ClientErrorType | null>(null)

  const form = useForm<StaffValues>({
    resolver: zodResolver(staffRequestSchema),
    defaultValues: initialValues || {},
    mode: 'onChange',
  })

  // Create farmer staff
  const useCreateStaff = createPostMutationHook({
    endpoint: '/users/farmer-staff',
    requestSchema: staffRequestSchema,
    responseSchema: staffResponseSchema,
  })

  const useCreateStaffMutation = useCreateStaff()

  const onSubmit = async (values: StaffValues) => {
    try {
      setError(null)
      if (mode === 'create') {
        await useCreateStaffMutation.mutate({ ...values })
        queryClient.invalidateQueries(['Farmer-Staffs'])
        queryClient.refetchQueries(['Farmer-Staffs'])
      } else if (mode === 'edit' && initialValues) {
        // await updateFarmerStaffMutation.mutateAsync({
        //   ...values,
        // })
        queryClient.invalidateQueries(['farmerStaff'])
        queryClient.refetchQueries(['farmerStaff-details'])
      }

      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} staff error:`, err)
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {error && <FormValidationErrorAlert error={error} />}

          {/* Name Fields */}
          <Grid cols={2} gap="gap-4">
            <FlexBox direction="col" className="w-full" gap="gap-1">
              <Text className="flex items-center text-sm font-medium text-neutral-700">
                First Name <span className="font-bold text-red-500">*</span>
              </Text>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            <FlexBox direction="col" className="w-full" gap="gap-1">
              <Text className="flex items-center text-sm font-medium text-neutral-700">
                Last Name <span className="font-bold text-red-500">*</span>
              </Text>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input state={fieldState.error ? 'error' : 'default'} placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </Grid>

          {/* Email */}
          <div>
            <Text className="mb-2 flex items-center text-sm font-medium text-neutral-700">
              Email <span className="font-bold text-red-500">*</span>
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

          {/* Phone */}
          <div>
            <Text className="mb-2 flex items-center text-sm font-medium text-neutral-700">
              Phone Number <span className="font-bold text-red-500">*</span>
            </Text>
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
          </div>

          {/* Address */}
          <div>
            <Text className="mb-2 flex items-center text-sm font-medium text-neutral-700">
              Address <span className="font-bold text-red-500">*</span>
            </Text>
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
            <Checkbox />
          </Grid>

          <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 bg-white font-medium text-primary-500"
              onClick={onClose}
            >
              <Text>Back</Text>
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              <>
                <Text color="text-inherit" variant="body">
                  Create
                </Text>
              </>
            </Button>
          </FlexBox>
        </form>
      </Form>
    </>
  )
}
