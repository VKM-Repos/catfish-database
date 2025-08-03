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
import { ClientErrorType, ServerErrorType } from 'src/types'
import { Grid } from 'src/components/ui/grid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { scrollToTop } from 'src/lib/utils'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import DatePicker from 'src/components/ui/datepicker'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { MaintenanceActivityTypes } from 'src/lib/constants'
import { useLocation } from 'react-router-dom'

const maintenanceSchema = z.object({
  date: z.string().min(1, 'Date is required').optional(),
  frequency: z.string().optional(), // remove later
  maintenanceType: z.enum(Object.values(MaintenanceActivityTypes) as [string, ...string[]], {
    required_error: 'Maintenance type is required',
  }),
  cost: z.number({ required_error: 'Cost is required' }),
  pondId: z.string().min(1, 'Pond is required').optional(),
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

type MaintenanceRecordsFormProps = {
  onCancel: () => void
  setStep: (step: number) => void
  mode: 'create' | 'edit'
  initialValues?: any
  onSuccess?: () => void
}

export default function MaintenanceRecordsForm({
  onCancel,
  setStep,
  mode,
  initialValues,
  onSuccess,
}: MaintenanceRecordsFormProps) {
  const [error, setError] = useState<ClientErrorType | null>()
  const queryClient = useQueryClient()

  const { state } = useLocation()
  const record = state?.item

  const useCreateMaintenanceMutation = createPostMutationHook({
    endpoint: '/maintenance-costs',
    requestSchema: maintenanceSchema,
    responseSchema: z.any(),
  })

  const useUpdateMaintenanceMutation = createPutMutationHook({
    endpoint: `/maintenance-costs/${record?.id}`,
    requestSchema: maintenanceSchema,
    responseSchema: z.any(),
  })

  const createMaintenanceMutation = useCreateMaintenanceMutation()
  const updateMaintenanceMutation = useUpdateMaintenanceMutation()

  const form = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      date: record?.createdAt ?? undefined,
      maintenanceType: record?.maintenanceType ?? '',
      cost: record?.cost ?? undefined,
      pondId: record?.id ?? undefined,
    },
    mode: 'onChange',
  })

  // Fetch ponds
  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds'],
  })
  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()
  const pondId = record?.id || form.watch('pondId')

  const onSubmit = async (values: MaintenanceFormData) => {
    try {
      setError(null)

      const basePayload = {
        // date: values.date,
        maintenanceType: values.maintenanceType,
        cost: values.cost !== undefined && !isNaN(Number(values.cost)) ? Number(values.cost) : 0, // Ensure cost is a number
        pondId: pondId,
        frequency: 'DAILY',
      }
      if (mode === 'create') {
        await createMaintenanceMutation.mutateAsync(basePayload)
        queryClient.refetchQueries(['maintenance-costs'])
        form.reset()
        onSuccess?.()
        setStep(2)
      } else if (mode === 'edit' && pondId) {
        await updateMaintenanceMutation.mutateAsync(basePayload)
        queryClient.refetchQueries(['maintenance-costs'])
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
                  name="maintenanceType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={(val) => field.onChange(val === '' ? undefined : val)}
                        >
                          <SelectTrigger className="w-full font-light">
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent className="z-[2000]">
                            {Object.values(MaintenanceActivityTypes).map((type) => {
                              // Format: remove underscores, capitalize each word
                              const label = type
                                .toLowerCase()
                                .split('_')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                              return (
                                <SelectItem key={type} value={type}>
                                  {label}
                                </SelectItem>
                              )
                            })}
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
                        <Input
                          placeholder="Enter cost"
                          {...field}
                          value={field.value ?? ''}
                          type="number"
                          min={0}
                          step="any"
                          onChange={(e) => {
                            const val = e.target.value
                            // Only allow numbers and empty string
                            if (/^\d*\.?\d*$/.test(val)) {
                              field.onChange(val === '' ? undefined : e.target.valueAsNumber)
                            }
                          }}
                          inputMode="decimal"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </Grid>
            {mode === 'create' && (
              <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
                <div className="flex w-full flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Pond
                    {/* <span className="font-bold text-red-500">*</span> */}
                    <SolarIconSet.QuestionCircle size={16} />
                  </Text>
                  <FormField
                    control={form.control}
                    name="pondId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger
                              className={form.formState.errors.pondId ? 'border-red-500 ring-2 ring-red-500' : ''}
                            >
                              <div className="flex w-full items-center justify-start gap-3 text-neutral-300">
                                <SolarIconSet.Water size={24} />
                                <SelectValue placeholder="Select a pond" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="z-[2000]">
                              {isLoadingPonds ? (
                                <SelectItem value="loading" disabled>
                                  <Text>Loading ponds...</Text>
                                </SelectItem>
                              ) : (
                                ponds.content?.map((pond: any) => (
                                  <SelectItem key={pond.id} value={pond.id}>
                                    {pond.name}
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
              </FlexBox>
            )}
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
