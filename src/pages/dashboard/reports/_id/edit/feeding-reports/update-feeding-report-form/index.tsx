import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormField, FormItem, FormControl, FormDescription } from 'src/components/ui/form'
import { Button } from 'src/components/ui/button'
import { Switch } from 'src/components/ui/switch'
import { Text } from 'src/components/ui/text'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'

import FishFeedingForm from 'src/pages/dashboard/reports/components/forms/feeding-report/fish-feeding-form'
import WaterQualityForm from 'src/pages/dashboard/reports/components/forms/feeding-report/water-quality-form'

import { dailyFeedingSchema, dailyWaterQualitySchema } from 'src/schemas'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'

type FormData = z.infer<typeof dailyFeedingSchema> & z.infer<typeof dailyWaterQualitySchema>

type UpdateFeedingReportProps = {
  onCancel: () => void
  setStep: (step: number) => void
}

const useGetFeedingReports = createGetQueryHook({
  endpoint: '/feeding-water-qualities/:id',
  responseSchema: z.any(),
  queryKey: ['feeding-water-quality-details'],
})

export default function UpdateFeedingReportForm({ onCancel, setStep }: UpdateFeedingReportProps) {
  const [error, setError] = useState<ClientErrorType | null>(null)
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetFeedingReports({ route: { id: id! } })

  // 1) set up RHF
  const form = useForm<FormData>({
    resolver: zodResolver(dailyFeedingSchema.merge(dailyWaterQualitySchema)),
    defaultValues: {
      feedType: '',
      pelletSize: '',
      feedQuantity: null,
      feedTime: '',
      observation: '',
      dissolvedOxygen: '',
      phLevel: '',
      temperature: '',
      ammonia: '',
      nitrite: '',
      nitrate: '',
      alkalinity: '',
      hardness: '',
      recordWaterQuality: false,
    },
    mode: 'onChange',
  })

  // 2) when data arrives, reset once
  // after you fetch `data`…
  useEffect(() => {
    if (!isLoading && data) {
      // turn 'PELLETS' → 'Pellets'
      const feedTypeOption = data.feedType?.toLowerCase().replace(/^./, (c: any) => c.toUpperCase()) ?? ''

      // turn 3.0 → '3.0mm'
      const pelletSizeOption = data.pelletSize != null ? `${Number(data.pelletSize).toFixed(1)}mm` : ''
      // detect if any WQ present…
      const hasWQ = [
        data.dissolvedOxygen,
        data.phLevel,
        data.temperature,
        data.ammonia,
        data.nitrate,
        data.alkalinity,
        data.hardness,
      ].some((v) => v != null)

      form.reset({
        feedType: feedTypeOption,
        pelletSize: pelletSizeOption,
        feedQuantity: data.quantity ?? null,
        feedTime: data.feedTime ?? '',
        observation: data.observation ?? '',
        recordWaterQuality: hasWQ,

        // water‐quality fields:
        dissolvedOxygen: data.dissolvedOxygen ?? '',
        phLevel: data.phLevel ?? '',
        temperature: data.temperature ?? '',
        ammonia: data.ammonia ?? '',
        nitrite: data.nitrite ?? '',
        nitrate: data.nitrate ?? '',
        alkalinity: data.alkalinity ?? '',
        hardness: data.hardness ?? '',
      })
    }
  }, [data, isLoading, form])

  // 3) update mutation
  const updateMutation = createPutMutationHook({
    endpoint: `/feeding-water-qualities/${id}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })()

  const onSubmit = async (values: FormData) => {
    try {
      setError(null)

      // feeding data
      const feedingData = {
        pondId: id,
        feedType: values.feedType?.toUpperCase(),
        pelletSize: values.pelletSize ? Number(values.pelletSize.replace('mm', '')) : null,
        quantity: Number(values.feedQuantity),
        // feedTime: values.feedTime,
      }

      // water quality (optional)
      const waterQualityData = values.recordWaterQuality
        ? {
            dissolvedOxygen: values.dissolvedOxygen ? Number(values.dissolvedOxygen) : null,
            phLevel: values.phLevel ? Number(values.phLevel) : null,
            temperature: values.temperature ? Number(values.temperature) : null,
            ammonia: values.ammonia ? Number(values.ammonia) : null,
            nitrite: values.nitrite ? Number(values.nitrite) : null,
            nitrate: values.nitrate ? Number(values.nitrate) : null,
            alkalinity: values.alkalinity ? Number(values.alkalinity) : null,
            hardness: values.hardness ? Number(values.hardness) : null,
            frequency: 'DAILY',
            observation: values.observation || 'EXCELLENT',
          }
        : {}

      const payload = { ...feedingData, ...waterQualityData }
      await updateMutation.mutateAsync(payload)

      // refresh & next
      queryClient.refetchQueries(['feeding-water-quality-details'])
      queryClient.refetchQueries(['feeding-water-quality'])

      setStep(2)
    } catch (err) {
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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader type="spinner" size={40} />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">
        <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
          <FlexBox justify="center" align="center" className="w-full">
            <Text className="text-xl font-semibold text-neutral-700">Edit Record</Text>
          </FlexBox>
        </div>
        {error && <FormValidationErrorAlert error={error} />}

        <Text className="border-b pb-2 font-semibold">Feeding Details</Text>
        <FishFeedingForm form={form} />

        <FormField
          control={form.control}
          name="recordWaterQuality"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormDescription>Record Water Quality?</FormDescription>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('recordWaterQuality') && (
          <>
            <Text className="border-b pb-2 font-semibold">Water Quality</Text>
            <WaterQualityForm form={form} />
          </>
        )}

        <FlexBox justify="between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.formState.isValid || updateMutation.isLoading}>
            {updateMutation.isLoading ? 'Updating…' : 'Continue'}
          </Button>
        </FlexBox>
      </form>
    </Form>
  )
}
