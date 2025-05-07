import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { pondResponseSchema, pondSchema } from 'src/schemas'
import { z } from 'zod'
import AddPondDetailsForm from './forms/add-pond-details-form'
import AddPondLocationForm from './forms/add-pond-location-form'
import { Button } from 'src/components/ui/button'
import { usePondStore } from 'src/store/pond.store'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { useEffect, useState } from 'react'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { createGetQueryHook } from 'src/api/hooks/useGet'

type PondData = z.infer<typeof pondSchema>

const useFetchCurrentCluster = createGetQueryHook({
  endpoint: '/clusters/me',
  responseSchema: z.any(),
  queryKey: ['cluster_for_current_farmer'],
})

export default function AddPond() {
  const { pondData, setPondStore } = usePondStore()
  const [error, setError] = useState<ClientErrorType | null>()

  const { data: current_cluster } = useFetchCurrentCluster()

  const form = useForm<PondData>({
    resolver: zodResolver(pondSchema),
    defaultValues: {
      name: pondData?.name ?? '',
      status: 'Active',
      size: pondData?.size ?? '',
      waterSource: pondData?.waterSource ?? '',
      pondType: pondData?.pondType ?? '',
      clusterId: current_cluster?.id ?? '',
      longitude: pondData?.longitude ?? '',
      latitude: pondData?.latitude ?? '',
    },
    mode: 'onChange',
  })

  const useCreatePond = createPostMutationHook({
    endpoint: '/ponds/farmers',
    requestSchema: pondSchema,
    responseSchema: pondResponseSchema,
  })

  const createPondMutation = useCreatePond()

  const onSubmit = async (values: z.infer<typeof pondSchema>) => {
    try {
      setError(null)
      setPondStore({
        ...pondData,
        ...values,
      })

      await createPondMutation.mutateAsync({
        ...values,
      })
    } catch (err) {
      console.error('Error updating pond:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData?.error,
            message: errorData?.message,
            errors: errorData?.errors ?? null,
          })
        }
      }
    }
  }

  useEffect(() => {
    if (current_cluster?.id) {
      form.reset({
        ...form.getValues(),
        clusterId: current_cluster.id,
      })
    }
  }, [current_cluster?.id])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col items-start gap-1">
          <h5 className="text-[1.5rem] font-bold text-[#444955]">Pond Details</h5>
          <hr className="w-full border border-primary-200" />
        </div>
        <AddPondDetailsForm form={form} />

        <div className="mb-2 w-full items-start">
          <h5 className="text-[1.5rem] font-bold text-[#444955]">Pond Location</h5>
          <hr className="w-full border border-primary-200" />
        </div>
        <AddPondLocationForm form={form} />

        <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={!form.formState.isValid}>
          Continue
        </Button>
      </form>
    </Form>
  )
}
