import { useState } from 'react'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { Loader } from 'src/components/ui/loader'

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

      const payload = { ...feedingData }
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

  return <div>Edit</div>
}
