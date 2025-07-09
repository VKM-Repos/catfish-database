import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

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

import { feedTypeResponseSchema, feedTypeCreateSchema, feedTypeEditSchema } from 'src/schemas'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { scrollToTop } from 'src/lib/utils'
import { createPutMutationHook } from 'src/api/hooks/usePut'

import DatePicker from 'src/components/ui/datepicker'
import { AvailableFeedTypes, PelletSizes } from 'src/lib/constants'

type FeedingTypeData = z.infer<typeof feedTypeCreateSchema> | z.infer<typeof feedTypeEditSchema>

type FeedStockFormProps = {
  onCancel: () => void
  setStep: (step: number) => void
  mode: 'create' | 'edit'
  initialValues?: any
  onSuccess?: () => void
}

export default function FeedStockForm({
  onCancel,
  setStep,
  mode,
  initialValues: _initialValues,
  onSuccess,
}: FeedStockFormProps) {
  const location = useLocation()
  // Get initial values from state if present, otherwise use prop
  const initialValues = location.state?.item || _initialValues

  const [error, setError] = useState<ClientErrorType | null>()
  const queryClient = useQueryClient()

  const useCreateFeedStockMutation = createPostMutationHook({
    endpoint: '/feed-inventories',
    requestSchema: feedTypeCreateSchema,
    responseSchema: feedTypeResponseSchema,
  })

  const useUpdateFeedStockMutation = createPutMutationHook({
    endpoint: `/feed-inventories/${initialValues?.id}`,
    requestSchema: feedTypeEditSchema,
    responseSchema: feedTypeResponseSchema,
  })

  const createFeedStockMutation = useCreateFeedStockMutation()
  const updateFeedStockMutation = useUpdateFeedStockMutation()

  const form = useForm<FeedingTypeData>({
    resolver: zodResolver(initialValues ? feedTypeEditSchema : feedTypeCreateSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  const quantityInKg = form.watch('quantityInKg')
  const totalCost = form.watch('totalCost')

  const cost =
    quantityInKg && totalCost && !isNaN(Number(totalCost)) && Number(quantityInKg) !== 0
      ? Math.round((Number(totalCost) / Number(quantityInKg)) * 10) / 10
      : 0

  useEffect(() => {
    if (!isNaN(cost) && isFinite(cost)) {
      form.setValue('costPerKg', cost)
    }
  }, [form.setValue, cost])

  const onSubmit = async (values: FeedingTypeData) => {
    try {
      setError(null)

      const basePayload = {
        ...values,
        sizeInMm: values.sizeInMm !== undefined ? Number(values.sizeInMm) : 0,
        quantityInKg: values.quantityInKg !== undefined ? Number(values.quantityInKg) : 0,
        costPerKg: values.costPerKg !== undefined ? Number(values.costPerKg) : 0,
      }

      if (!initialValues?.id) {
        await createFeedStockMutation.mutateAsync(basePayload as any)
        queryClient.refetchQueries(['feed-inventories'])
        form.reset()
        onSuccess?.()
        setStep(2)
      } else {
        await updateFeedStockMutation.mutateAsync({
          id: initialValues.id,
          ...basePayload,
        } as any)
        queryClient.refetchQueries(['feed-inventories'])
        form.reset()
        onSuccess?.()
        setStep(2)
      }
    } catch (err) {
      console.error('Error adding feed type:', err)
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

  // Hide Feed Type and Pellet Size if initialValues is present (i.e., opened from Add action)
  const hideFeedTypeAndPelletSize = Boolean(initialValues)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col gap-10">
          <Grid cols={3} gap="gap-2" className={` ${hideFeedTypeAndPelletSize ? '!grid-cols-1' : 'md:!grid-cols-3'}`}>
            {!hideFeedTypeAndPelletSize && (
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Feed Type
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(v) => {
                            if (v === 'add_custom') {
                              console.log('open dialog')
                            } else {
                              field.onChange(v)
                            }
                          }}
                        >
                          <SelectTrigger className="w-full font-light">
                            <div className="flex items-center justify-center gap-2">
                              <SolarIconSet.Weigher />
                              <SelectValue placeholder="Select Feed Type" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AvailableFeedTypes).map((type) => {
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
                            {/* <SelectItem value="add_custom">
                              <span className="text-primary-500">+ Add custom</span>
                            </SelectItem> */}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
            )}
            {!hideFeedTypeAndPelletSize && (
              <FlexBox direction="col" gap="gap-2" className="w-full">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Pellet size
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="sizeInMm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          value={field.value !== undefined ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger className="w-full font-light">
                            <div className="flex items-center justify-center gap-2">
                              <SolarIconSet.Weigher />
                              <SelectValue placeholder="Select Pellet size" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {PelletSizes?.map((pellet) => (
                              <SelectItem key={pellet} value={parseFloat(pellet).toString()}>
                                {pellet}
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
            )}
            <FlexBox direction="col" gap="gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Feed Quantity
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="quantityInKg"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="w-full">
                        <Input
                          placeholder="Input quantity in kg"
                          {...field}
                          value={field.value ?? ''}
                          type="number"
                          min={0}
                          step="any"
                          onChange={(e) => {
                            const val = e.target.value
                            // Only allow numbers and empty string
                            if (/^\d*\.?\d*$/.test(val)) {
                              field.onChange(val === '' ? undefined : Number(val))
                            }
                          }}
                          inputMode="decimal"
                          pattern="[0-9]*"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </Grid>

          <Grid cols={3} gap="gap-2" className="!grid-cols-1 md:!grid-cols-3">
            <FlexBox direction="col" gap="gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Date
                <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="time"
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
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                {' '}
                Total cost (₦)
                <span className="font-bold text-red-500">*</span>
              </Text>
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem className="w-full !space-y-0">
                    <FormControl>
                      <div className="w-full">
                        <Input
                          placeholder="Input cost of feed"
                          {...field}
                          value={field.value ?? ''}
                          type="number"
                          min={0}
                          step="any"
                          onChange={(e) => {
                            const val = e.target.value
                            // Only allow numbers and empty string
                            if (/^\d*\.?\d*$/.test(val)) {
                              field.onChange(val === '' ? undefined : val)
                            }
                          }}
                          inputMode="decimal"
                          pattern="[0-9]*"
                        />
                      </div>
                    </FormControl>
                    <div className={`relative min-h-fit`}>
                      <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Cost per kg (₦)
                <span className="font-bold text-red-500">*</span>
              </Text>
              <FormField
                control={form.control}
                name="costPerKg"
                render={({ field }) => (
                  <FormItem className="w-full !space-y-0">
                    <FormControl>
                      <div className="w-full">
                        <Input placeholder="0" {...field} className="bg-neutral-200 !text-black" disabled />
                      </div>
                    </FormControl>
                    <div className={`relative min-h-fit`}>
                      <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Grid>
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
            {createFeedStockMutation.isLoading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text color="text-inherit" variant="body">
                  Updating
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
