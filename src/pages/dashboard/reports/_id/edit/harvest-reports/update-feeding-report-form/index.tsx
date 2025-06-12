import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormDescription } from 'src/components/ui/form'
import { Button } from 'src/components/ui/button'
import { Switch } from 'src/components/ui/switch'
import { Text } from 'src/components/ui/text'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'

import FishFeedingForm from 'src/pages/dashboard/reports/components/forms/feeding-report/fish-feeding-form'
import WaterQualityForm from 'src/pages/dashboard/reports/components/forms/feeding-report/water-quality-form'

import { dailyFeedingSchema } from 'src/schemas'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'

type FormData = z.infer<typeof dailyFeedingSchema>

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
  const [recordWaterQuality, setRecordWaterQuality] = useState(false)

  // 1) set up RHF
  const form = useForm<FormData>({
    resolver: zodResolver(dailyFeedingSchema),
    defaultValues: {
      feedType: '',
      pelletSize: '',
      feedQuantity: '',
      feedTime: '',
      observation: '',
      dissolvedOxygen: '',
      phLevel: '',
      temperature: '',
      ammonia: '',
      nitrite: '',
      alkalinity: '',
      hardness: '',
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

      form.reset({
        feedType: feedTypeOption,
        pelletSize: pelletSizeOption,
        feedQuantity: data.quantity ?? null,
        feedTime: data.feedTime ?? '',
        observation: data.observation ?? '',

        // water‐quality fields:
        dissolvedOxygen: data.dissolvedOxygen ?? '',
        phLevel: data.phLevel ?? '',
        temperature: data.temperature ?? '',
        ammonia: data.ammonia ?? '',
        nitrite: data.nitrite ?? '',
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
      const waterQualityData = recordWaterQuality
        ? {
            dissolvedOxygen: values.dissolvedOxygen ? Number(values.dissolvedOxygen) : null,
            phLevel: values.phLevel ? Number(values.phLevel) : null,
            temperature: values.temperature ? Number(values.temperature) : null,
            ammonia: values.ammonia ? Number(values.ammonia) : null,
            nitrite: values.nitrite ? Number(values.nitrite) : null,
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

        <FormDescription>Record Water Quality?</FormDescription>

        <Switch
          onCheckedChange={(e: boolean) => {
            setRecordWaterQuality(e)
            // Reset water quality fields when toggling
            form.reset(
              {
                ...form.getValues(),
                dissolvedOxygen: '',
                phLevel: '',
                temperature: '',
                ammonia: '',
                nitrite: '',
                alkalinity: '',
                hardness: '',
                observation: '',
              },
              {
                keepErrors: false,
                keepDirty: false,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                keepSubmitCount: false,
              },
            )
          }}
        />

        {recordWaterQuality && (
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
