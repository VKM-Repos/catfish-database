import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form } from 'src/components/ui/form'
import { Text } from 'src/components/ui/text'
import { fishDetailsResponseSchema, fishDetailsSchema, paginatedPondResponseSchema } from 'src/schemas'
import { usePondStore } from 'src/store/pond.store'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { useEffect, useState } from 'react'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useQueryClient } from '@tanstack/react-query'
import CancelPrompt from '../prompts/cancel-prompt'
import PromptNewFish from '../prompts/prompt-new-fish'
import BatchPondSelection from './forms/batch-pond-selection'
import FishDetailsForm from './forms/fish-details'
import SupplierInfoForm from './forms/supplier-info'
import CostDetailsForm from './forms/cost-details'

const useGetFarmerPonds = createGetQueryHook<typeof paginatedPondResponseSchema, { id: string }>({
  endpoint: '/ponds/farmers/me',
  responseSchema: paginatedPondResponseSchema,
  queryKey: ['my-ponds-as-a-farmer'],
})

const useCreateFishBatch = createPostMutationHook({
  endpoint: '/fish-batches',
  requestSchema: fishDetailsSchema,
  responseSchema: fishDetailsResponseSchema,
})

export default function AddFishPond() {
  const { pondData, setPondStore } = usePondStore()
  const { data: ponds, isLoading } = useGetFarmerPonds()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [error, setError] = useState<ClientErrorType | null>(null)
  const [open, setOpen] = useState(false)
  const [openCancelPrompt, setOpenCancelPrompt] = useState(false)

  const pondNames = ponds?.content.map((pond) => pond.name) || ['']
  const fishSizes = ['Fingerling', 'Fry', 'Post-fingerling', 'Juvenile', 'Jumbo', 'Table size', 'Broodstock', 'Adult']

  const form = useForm({
    resolver: zodResolver(fishDetailsSchema),
    defaultValues: {
      pondId: '',
      batchName: '',
      quantity: '',
      supplier: '',
      singleCost: '',
      costOfSupply: '',
      fishDescription: '',
      fishSize: '',
    },
    mode: 'onChange',
  })

  const quantity = form.watch('quantity')
  const singleCost = form.watch('singleCost')

  const total = String(Number(singleCost) * Number(quantity) || 0)

  const isValidCost = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value)

  useEffect(() => {
    if (isValidCost(total)) {
      form.setValue('costOfSupply', total)
    }
  }, [form.setValue, total])

  const createFishBatch = useCreateFishBatch()

  const onSubmit = async (values: z.infer<typeof fishDetailsSchema>) => {
    const selectedPond = ponds?.content.find((pond: any) => pond.name === values.pondId)

    try {
      setPondStore({
        ...pondData,
        pondId: selectedPond?.id,
        quantity: values.quantity,
        costOfSupply: values.costOfSupply,
        fishDescription: values.fishDescription,
        fishSize: values.fishSize,
      })

      await createFishBatch.mutateAsync({
        ...values,
        pondId: selectedPond?.id as string,
      })

      queryClient.refetchQueries(['fish-batches'])
      queryClient.refetchQueries(['my-ponds'])

      setOpen(true)
    } catch (err) {
      console.error('Error creating fish batch:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data
        console.log(errorData)
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

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <FlexBox direction="col" gap="gap-5" align="center" className="w-full">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="mb-2 w-full items-start gap-1">
          <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish Details</h5>
          <hr className="w-full border border-primary-200" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
            <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
              <BatchPondSelection form={form} pondNames={pondNames} />
              <FishDetailsForm form={form} fishSizes={fishSizes} />
              <SupplierInfoForm form={form} />
              <CostDetailsForm form={form} />
            </FlexBox>
            <div className="flex w-full items-center justify-between bg-neutral-50 px-6 py-3">
              <Button
                variant="outline"
                type="button"
                className="rounded-lg bg-white"
                onClick={() => setOpenCancelPrompt(true)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex items-center gap-2"
                // disabled={!form.formState.isValid}
              >
                {createFishBatch.isLoading ? (
                  <>
                    <Loader type="spinner" size={18} />
                    <Text color="text-inherit" variant="body">
                      Updating
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="text-inherit" variant="body">
                      Save
                    </Text>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </FlexBox>
      <CancelPrompt
        openCancelPrompt={openCancelPrompt}
        setOpenCancelPrompt={setOpenCancelPrompt}
        handleCancelYes={handleCancelYes}
        handleCancelNo={handleCancelNo}
      />
      <PromptNewFish
        open={open}
        setOpen={setOpen}
        handleNoConditionOnClose={handleNoConditionOnClose}
        handleYesConditionOnClose={handleYesConditionOnClose}
      />
    </>
  )
}
