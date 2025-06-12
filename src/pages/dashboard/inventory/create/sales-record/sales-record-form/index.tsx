import { useState, useEffect } from 'react'
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
import { Input } from 'src/components/ui/input'
import { Grid } from 'src/components/ui/grid'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { scrollToTop } from 'src/lib/utils'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'
import * as SolarIconSet from 'solar-icon-set'

const salesRecordSchema = z.object({
  fishHarvested: z.string().min(1, 'Number of fish harvested is required'),
  totalWeight: z.string().min(1, 'Total weight is required'),
  totalCost: z.string().min(1, 'Total cost is required'),
  costPerKg: z.string().optional(),
  costPerFish: z.string().optional(),
})

type SalesRecordsFormData = z.infer<typeof salesRecordSchema>

type SalesRecordsFormProps = {
  onCancel: () => void
  setStep: (step: number) => void
  mode: 'create' | 'edit'
  initialValues?: any
  onSuccess?: () => void
}

export default function SalesRecordsForm({ onCancel, setStep, mode, initialValues, onSuccess }: SalesRecordsFormProps) {
  const [error, setError] = useState<ClientErrorType | null>()
  const queryClient = useQueryClient()

  const useCreateSalesRecordMutation = createPostMutationHook({
    endpoint: '/sales-records',
    requestSchema: salesRecordSchema,
    responseSchema: salesRecordSchema,
  })

  const useUpdateSalesRecordMutation = createPutMutationHook({
    endpoint: `/sales-records/${initialValues?.id}`,
    requestSchema: salesRecordSchema,
    responseSchema: salesRecordSchema,
  })

  const createSalesRecordMutation = useCreateSalesRecordMutation()
  const updateSalesRecordMutation = useUpdateSalesRecordMutation()

  const form = useForm<SalesRecordsFormData>({
    resolver: zodResolver(salesRecordSchema),
    defaultValues: {
      fishHarvested: initialValues?.fishHarvested || '',
      totalWeight: initialValues?.totalWeight || '',
      totalCost: initialValues?.totalCost || '',
      costPerKg: initialValues?.costPerKg || '',
      costPerFish: initialValues?.costPerFish || '',
    },
    mode: 'onChange',
  })

  // Calculate cost per kg and cost per fish
  const fishHarvested = Number(form.watch('fishHarvested'))
  const totalWeight = Number(form.watch('totalWeight'))
  const totalCost = Number(form.watch('totalCost'))

  const costPerKg = totalWeight && totalCost ? (totalCost / totalWeight).toFixed(2) : ''
  const costPerFish = fishHarvested && totalCost ? (totalCost / fishHarvested).toFixed(2) : ''

  useEffect(() => {
    form.setValue('costPerKg', costPerKg)
    form.setValue('costPerFish', costPerFish)
  }, [costPerKg, costPerFish, form])

  const onSubmit = async (values: SalesRecordsFormData) => {
    try {
      setError(null)
      if (mode === 'create') {
        await createSalesRecordMutation.mutateAsync(values)
        queryClient.refetchQueries(['sales-records'])
        form.reset()
        onSuccess?.()
        setStep(2)
      } else if (mode === 'edit' && initialValues?.id) {
        await updateSalesRecordMutation.mutateAsync(values)
        queryClient.refetchQueries(['sales-records'])
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col gap-10">
          <Grid cols={2} gap="gap-4" className="!grid-cols-1 md:!grid-cols-2">
            {/* Number of fish harvested - full span */}
            <FlexBox direction="col" gap="gap-2" className="col-span-2 w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Number of fish harvested
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="fishHarvested"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Number of fish harvested" {...field} value={field.value ?? ''} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            {/* Total weight - col 1 */}
            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Total weight of fish harvested (kg)
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="totalWeight"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Total weight of fish harvested (kg)"
                        {...field}
                        value={field.value ?? ''}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            {/* Total cost - col 2 */}
            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Total cost of fish harvested (₦)
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Total cost of fish harvested (₦)"
                        {...field}
                        value={field.value ?? ''}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            {/* Cost per kg - calculated, disabled */}
            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Cost per kg (₦)
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="costPerKg"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Cost per kg (₦)"
                        {...field}
                        value={field.value ?? ''}
                        type="text"
                        className="bg-neutral-200 !text-black"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            {/* Cost per fish - calculated, disabled */}
            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Cost per fish (₦)
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="costPerFish"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Cost per fish (₦)"
                        {...field}
                        value={field.value ?? ''}
                        type="text"
                        className="bg-neutral-200 !text-black"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </Grid>
        </div>
        <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-white font-medium text-primary-500"
            onClick={onCancel}
          >
            <Text>Back</Text>
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
            disabled={!form.formState.isValid}
          >
            {createSalesRecordMutation.isLoading || updateSalesRecordMutation.isLoading ? (
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
  )
}
