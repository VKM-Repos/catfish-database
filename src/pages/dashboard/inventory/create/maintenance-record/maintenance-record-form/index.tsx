import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormField, FormItem, FormControl, FormMessage } from 'src/components/ui/form'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'
import * as SolarIconSet from 'solar-icon-set'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { Grid } from 'src/components/ui/grid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { scrollToTop } from 'src/lib/utils'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { useLocation } from 'react-router-dom'
import DatePicker from 'src/components/ui/datepicker'

const maintenanceSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  activityType: z.enum(['Cleaning', 'Repairs', 'Disinfection', 'Others'], {
    required_error: 'Activity type is required',
  }),
  cost: z.string().min(1, 'Cost is required'),
  description: z.string().min(1, 'Description is required'),
  pond: z.string().min(1, 'Pond is required'),
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

type MaintenanceRecordsFormProps = {
  onCancel: () => void
  setStep: (step: number) => void
  mode: 'create' | 'edit'
  initialValues?: any
  onSuccess?: () => void
}

const activityTypes = ['Cleaning', 'Repairs', 'Disinfection', 'Others']

export default function MaintenanceRecordsForm({
  onCancel,
  setStep,
  mode,
  initialValues,
  onSuccess,
}: MaintenanceRecordsFormProps) {
  const [error, setError] = useState<ClientErrorType | null>()
  const queryClient = useQueryClient()
  const location = useLocation()

  // Mock ponds for select
  const ponds = [
    { label: 'Pond A', value: 'Pond A' },
    { label: 'Pond B', value: 'Pond B' },
    { label: 'Pond C', value: 'Pond C' },
    { label: 'Pond D', value: 'Pond D' },
  ]

  const useCreateMaintenanceMutation = createPostMutationHook({
    endpoint: '/maintenance-expenses',
    requestSchema: maintenanceSchema,
    responseSchema: maintenanceSchema,
  })

  const useUpdateMaintenanceMutation = createPutMutationHook({
    endpoint: `/maintenance-expenses/${initialValues?.id}`,
    requestSchema: maintenanceSchema,
    responseSchema: maintenanceSchema,
  })

  const createMaintenanceMutation = useCreateMaintenanceMutation()
  const updateMaintenanceMutation = useUpdateMaintenanceMutation()

  const form = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      date: initialValues?.date || '',
      activityType: initialValues?.activityType || '',
      cost: initialValues?.cost || '',
      description: initialValues?.description || '',
      pond: initialValues?.pond || '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: MaintenanceFormData) => {
    try {
      setError(null)
      if (mode === 'create') {
        await createMaintenanceMutation.mutateAsync(values)
        queryClient.refetchQueries(['maintenance-expenses'])
        form.reset()
        onSuccess?.()
        setStep(2)
      } else if (mode === 'edit' && initialValues?.id) {
        await updateMaintenanceMutation.mutateAsync(values)
        queryClient.refetchQueries(['maintenance-expenses'])
        form.reset()
        onSuccess?.()
        setStep(2)
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data
        if (errorData) {
          setError({
            title: errorData?.error,
            message: errorData?.message,
            errors: errorData?.errors ?? null,
          })
          scrollToTop()
        }
      }
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
          {error && <FormValidationErrorAlert error={error} />}
          <div className="flex w-full flex-col gap-10">
            <Grid cols={3} gap="gap-2" className="!grid-cols-1 md:!grid-cols-3">
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Date
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <DatePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Activity Type
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full font-light">
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            {activityTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Cost (₦)
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter cost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </Grid>
            <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Description
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FlexBox>
            <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Pond
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="pond"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full font-light">
                            <SelectValue placeholder="Select pond" />
                          </SelectTrigger>
                          <SelectContent>
                            {ponds.map((pond) => (
                              <SelectItem key={pond.value} value={pond.value}>
                                {pond.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FlexBox>
          </div>
          <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 bg-white font-medium text-primary-500"
              onClick={() => {
                onCancel()
              }}
            >
              <Text>Back</Text>
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              {createMaintenanceMutation.isLoading || updateMaintenanceMutation.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text color="text-inherit" variant="body">
                    {mode === 'edit' ? 'Updating' : 'Saving'}
                  </Text>
                </>
              ) : (
                <>
                  <Text color="text-inherit" variant="body">
                    Continue
                  </Text>
                </>
              )}
            </Button>
          </FlexBox>
        </form>
      </Form>
    </>
  )
}
