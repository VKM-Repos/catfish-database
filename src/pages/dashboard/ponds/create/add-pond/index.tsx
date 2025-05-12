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
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { Loader } from 'src/components/ui/loader'
import { useQueryClient } from '@tanstack/react-query'
import CancelPrompt from '../prompts/cancel-prompt'
import PromptNewPond from '../prompts/prompt-new-pond'

type PondData = z.infer<typeof pondSchema>

const useFetchCurrentCluster = createGetQueryHook({
  endpoint: '/clusters/me',
  responseSchema: z.any(),
  queryKey: ['cluster_for_current_farmer'],
})

const useCreatePond = createPostMutationHook({
  endpoint: '/ponds/farmers',
  requestSchema: pondSchema,
  responseSchema: pondResponseSchema,
})

export default function AddPond() {
  const { pondData, setPondStore } = usePondStore()

  const [error, setError] = useState<ClientErrorType | null>()
  const [open, setOpen] = useState(false)
  const [openCancelPrompt, setOpenCancelPrompt] = useState(false)

  const navigate = useNavigate()

  const { data: current_cluster } = useFetchCurrentCluster()

  const queryClient = useQueryClient()

  const form = useForm<PondData>({
    resolver: zodResolver(pondSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      size: '',
      length: '',
      breadth: '',
      height: '',
      waterSource: '',
      pondType: '',
      clusterId: current_cluster?.id ?? '',
      longitude: '',
      latitude: '',
    },
    mode: 'onChange',
  })

  const length = form.watch('length')
  const breadth = form.watch('breadth')
  const height = form.watch('height')

  const total = String(Number(length) * Number(breadth) * Number(height) || 0)

  const isValidVolume = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value)

  useEffect(() => {
    if (isValidVolume(total)) {
      form.setValue('size', total)
    }
  }, [form.setValue, total])

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
      queryClient.refetchQueries(['my-ponds'])
      queryClient.refetchQueries(['fish-batches'])

      setOpen(true)
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

  const handleCancelYes = () => {
    setOpenCancelPrompt(false)
    navigate(paths.dashboard.ponds.root)
  }

  const handleCancelNo = () => {
    setOpenCancelPrompt(false)
  }

  const handleYesConditionOnClose = () => {
    form.reset()
    setOpen(false)
  }

  const handleNoConditionOnClose = () => {
    form.reset()
    setOpen(false)
    navigate(paths.dashboard.ponds.root)
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
    <>
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

          <FlexBox justify="between" align="center" className="w-full">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setOpenCancelPrompt(true)
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              {createPondMutation.isLoading ? (
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
      <CancelPrompt
        openCancelPrompt={openCancelPrompt}
        setOpenCancelPrompt={setOpenCancelPrompt}
        handleCancelYes={handleCancelYes}
        handleCancelNo={handleCancelNo}
      />
      <PromptNewPond
        open={open}
        setOpen={setOpen}
        handleNoConditionOnClose={handleNoConditionOnClose}
        handleYesConditionOnClose={handleYesConditionOnClose}
      />
    </>
  )
}
