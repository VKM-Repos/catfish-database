import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import {
  pondFormSchema,
  pondCreateSchema,
  pondEditSchema,
  pondResponseSchema,
  transformFormDataToApiData,
  transformApiDataToFormData,
} from 'src/schemas'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { usePondStore } from 'src/store/pond.store'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { useEffect, useState } from 'react'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader } from 'src/components/ui/loader'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from 'src/store/auth.store'
import { scrollToTop } from 'src/lib/utils'
import { Heading } from 'src/components/ui/heading'
import PondDetailsForm from './pond-details-form'
import PondLocationForm from './pond-location-form'

type PondFormData = z.infer<typeof pondFormSchema>
export type PondCreateData = z.infer<typeof pondCreateSchema>
type PondEditData = z.infer<typeof pondEditSchema>

interface PondFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<PondCreateData>
  onSuccess: () => void
  onClose: () => void
  farmerId?: string
  clusterId?: string
  pondId?: string
}

const useCreatePondMutation = (farmerId?: string | null) => {
  const createPondByFarmer = createPostMutationHook({
    endpoint: '/ponds/farmers',
    requestSchema: pondCreateSchema,
    responseSchema: z.any(),
  })

  const createPondByAdmin = createPostMutationHook({
    endpoint: '/ponds/cluster-managers',
    requestSchema: pondCreateSchema,
    responseSchema: z.any(),
  })

  const farmerMutation = createPondByFarmer()
  const adminMutation = createPondByAdmin()

  return farmerId ? adminMutation : farmerMutation
}

const useUpdatePondMutation = (pondId: string) => {
  return createPutMutationHook({
    endpoint: `/ponds/${pondId}`,
    requestSchema: pondEditSchema,
    responseSchema: pondResponseSchema,
  })()
}

export default function PondForm({
  mode,
  initialValues,
  onSuccess,
  onClose,
  farmerId,
  clusterId,
  pondId,
}: PondFormProps) {
  const { pondData, setPondStore } = usePondStore()
  const { user } = useAuthStore()

  const [error, setError] = useState<ClientErrorType | null>()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const from = searchParams.get('from')
  const navigate = useNavigate()

  const urlFarmerId = searchParams.get('farmerId')
  const urlClusterId = searchParams.get('clusterId')
  const createPondMutation = useCreatePondMutation(farmerId || urlFarmerId)
  const updatePondMutation = useUpdatePondMutation(pondId ?? '')

  const useFetchCurrentCluster = createGetQueryHook({
    endpoint: '/clusters/me',
    responseSchema: z.any(),
    queryKey: ['cluster_for_current_farmer'],
    options: {
      enabled: user?.role === 'FARMER',
    },
  })

  const { data: current_cluster } = useFetchCurrentCluster()

  const queryClient = useQueryClient()

  // Transform initial values to form format
  const transformedInitialValues: Partial<PondFormData> = initialValues ? transformApiDataToFormData(initialValues) : {}

  // Use the form schema for React Hook Form
  const form = useForm<PondFormData>({
    resolver: zodResolver(pondFormSchema),
    defaultValues: {
      name: transformedInitialValues.name || '',
      status: transformedInitialValues.status || 'Active',
      size: transformedInitialValues.size || '',
      length: transformedInitialValues.length || '',
      breadth: transformedInitialValues.breadth || '',
      depth: transformedInitialValues.depth || '',
      waterSource: transformedInitialValues.waterSource || '',
      pondType: transformedInitialValues.pondType || '',
      clusterId: transformedInitialValues.clusterId || current_cluster?.id || clusterId || urlClusterId || '',
      longitude: transformedInitialValues.longitude || '',
      latitude: transformedInitialValues.latitude || '',
      ...(farmerId && { farmerId }),
    },
    mode: 'onChange',
  })

  const length = form.watch('length')
  const breadth = form.watch('breadth')
  const depth = form.watch('depth')

  const total = Number(length) * Number(breadth) * Number(depth) || 0

  const isValidVolume = (value: number) => value > 0 && isFinite(value)

  useEffect(() => {
    if (isValidVolume(total)) {
      form.setValue('size', total.toString())
    }
  }, [form, total])

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      form.reset({
        ...form.getValues(),
        ...transformApiDataToFormData(initialValues),
      })
    }
  }, [mode, initialValues])

  const onSubmit = async (values: PondFormData) => {
    try {
      setError(null)
      const apiData = transformFormDataToApiData(values)

      setPondStore({
        ...pondData,
        ...values,
      })

      if (mode === 'edit' && pondId) {
        const editData = {
          ...apiData,
          id: pondId,
          waterSource: apiData.waterSource as z.infer<typeof pondEditSchema>['waterSource'],
          pondType: apiData.pondType as z.infer<typeof pondEditSchema>['pondType'],
        }
        await updatePondMutation.mutateAsync(editData)
      } else {
        const baseData = {
          ...apiData,
          waterSource: apiData.waterSource as z.infer<typeof pondCreateSchema>['waterSource'],
          pondType: apiData.pondType as z.infer<typeof pondCreateSchema>['pondType'],
        }

        const farmerIdValue = farmerId || urlFarmerId
        const createData = farmerIdValue ? { ...baseData, farmerId: farmerIdValue } : baseData
        await createPondMutation.mutateAsync(createData)
      }

      queryClient.refetchQueries(['my-ponds-in-ponds'])
      queryClient.refetchQueries(['fish-batches-in-ponds'])
      queryClient.refetchQueries(['my-ponds-in-samplings-splitting'])
      queryClient.refetchQueries(['my-ponds'])
      queryClient.refetchQueries(['all-ponds'])
      queryClient.refetchQueries(['fish-batches'])
      queryClient.refetchQueries(['pond-details-for-farmer'])
      queryClient.invalidateQueries(['my-ponds-in-creating-fish-batch'])
      queryClient.invalidateQueries(['my-ponds-farmer'])
      queryClient.invalidateQueries(['ponds_for_cluster_manager'])
      queryClient.invalidateQueries(['my-ponds-in-create-sales'])

      onSuccess()
    } catch (err) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} pond:`, err)
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

  useEffect(() => {
    if (current_cluster?.id && !form.getValues('clusterId')) {
      form.setValue('clusterId', current_cluster.id)
    }
  }, [current_cluster?.id, form])

  const isLoading = mode === 'edit' ? (pondId ? updatePondMutation?.isLoading : false) : createPondMutation.isLoading

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
        {error && <FormValidationErrorAlert error={error} />}

        <div className="flex w-full flex-col items-start gap-1">
          <Heading level={6}>Pond Details</Heading>
          <div className="h-0.5 w-full bg-neutral-200" />
        </div>
        <PondDetailsForm form={form} />

        <div className="mb-2 w-full items-start">
          <Heading level={6}>Pond Location</Heading>
          <div className="h-0.5 w-full bg-neutral-200" />
        </div>
        <PondLocationForm form={form} />

        <FlexBox justify="between" align="center" className="w-full rounded-lg bg-neutral-50 p-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text color="text-inherit" variant="body">
                  {mode === 'edit' ? 'Updating' : 'Creating'}
                </Text>
              </>
            ) : (
              <>
                <Text color="text-inherit" variant="body">
                  {mode === 'edit' ? 'Update Pond' : 'Continue'}
                </Text>
              </>
            )}
          </Button>
        </FlexBox>
      </form>
    </Form>
  )
}
