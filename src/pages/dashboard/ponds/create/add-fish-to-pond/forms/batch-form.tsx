import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { Button } from 'src/components/ui/button'
import { Loader } from 'src/components/ui/loader'
import { fishDetailsSchema, transformFishFormDataToApi, transformFishApiToForm } from 'src/schemas'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'

import { scrollToTop } from 'src/lib/utils'
import BatchPondSelection from './batch-pond-selection'
import FishDetailsForm from './fish-details'
import SupplierInfoForm from './supplier-info'
import CostDetailsForm from './cost-details'
import { ClientErrorType } from 'src/types'

const useGetPonds = createGetQueryHook({
  endpoint: '/ponds/farmers/me',
  responseSchema: z.any(),
  queryKey: ['my-ponds'],
})

const useCreateBatch = createPostMutationHook({
  endpoint: '/fish-batches',
  requestSchema: fishDetailsSchema,
  responseSchema: z.any(),
})

const useUpdateBatch = (id: string) =>
  createPutMutationHook({
    endpoint: `/fish-batches/${id}`,
    requestSchema: fishDetailsSchema,
    responseSchema: z.any(),
  })()

export type FishBatchFormData = z.infer<typeof fishDetailsSchema>

export interface FishBatchFormProps {
  mode: 'create' | 'edit'
  batchId?: string
  initialValues?: Partial<FishBatchFormData>
  onSuccess: () => void
  onClose: () => void
}

export default function FishBatchForm({ mode, batchId, initialValues, onSuccess, onClose }: FishBatchFormProps) {
  const { data: ponds = { content: [] }, isLoading } = useGetPonds()
  const createBatch = useCreateBatch()
  const updateBatch = useUpdateBatch(batchId ?? '')
  const queryClient = useQueryClient()

  const [error, setError] = useState<ClientErrorType | null>(null)

  const transformedInitial = initialValues ? transformFishApiToForm(initialValues) : {}
  const form = useForm<FishBatchFormData>({
    resolver: zodResolver(fishDetailsSchema),
    defaultValues: {
      // blank defaults ↓ + transformed server data (if any)
      pondId: '',
      batchName: '',
      quantity: '',
      supplier: '',
      singleCost: '',
      costOfSupply: '',
      initialWeight: '',
      fishSize: '',
      ...transformedInitial,
    },
    mode: 'onChange',
  })

  // Reset when edit‑data arrives
  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      form.reset({
        ...form.getValues(),
        ...transformFishApiToForm(initialValues),
      })
    }
  }, [mode, initialValues])

  // auto‑calculate cost
  const q = form.watch('quantity')
  const sc = form.watch('singleCost')
  // sc.replace(',', '')
  const total = String(Number(q) * Number(sc) || 0)
  useEffect(() => {
    if (/^[-+]?\d+(\.\d+)?$/.test(total)) form.setValue('costOfSupply', Number(total))
  }, [total])

  // ------------ submit
  const handleSubmit = async (values: FishBatchFormData) => {
    try {
      setError(null)
      const apiData = transformFishFormDataToApi(values, ponds.content)

      if (mode === 'edit' && batchId) {
        await updateBatch.mutateAsync(apiData)
        queryClient.invalidateQueries(['my-fish-batches'])
        queryClient.invalidateQueries(['my-ponds'])
        onSuccess()
      } else {
        await createBatch.mutateAsync(apiData)
        queryClient.invalidateQueries(['my-fish-batches'])
        queryClient.invalidateQueries(['my-ponds'])
        onSuccess()
      }

      queryClient.invalidateQueries(['my-fish-batches'])
      queryClient.invalidateQueries(['my-ponds'])
      onSuccess()
    } catch (err: any) {
      const data = err?.response?.data
      if (data) {
        setError({ title: data.error, message: data.message, errors: data.errors })
        scrollToTop()
      }
    }
  }

  if (isLoading) return <Loader size={28} className="mx-auto mt-10" />

  const pondNames = ponds.content.map((p: any) => p.name)
  const fishSizes = ['Fingerling', 'Fry', 'Post-fingerling', 'Juvenile']

  const isMutating = mode === 'edit' ? updateBatch.isLoading : createBatch.isLoading

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full flex-col space-y-8">
        {error && <FormValidationErrorAlert error={error} />}

        <BatchPondSelection form={form} pondNames={pondNames} />
        <FishDetailsForm form={form} fishSizes={fishSizes} />
        <SupplierInfoForm form={form} />
        <CostDetailsForm form={form} />

        <div className="flex items-center justify-between bg-neutral-50 px-6 py-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!form.formState.isValid || isMutating}>
            {isMutating ? (
              <>
                <Loader type="spinner" size={18} />
                {mode === 'edit' ? 'Updating' : 'Creating'}
              </>
            ) : mode === 'edit' ? (
              'Update batch'
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
