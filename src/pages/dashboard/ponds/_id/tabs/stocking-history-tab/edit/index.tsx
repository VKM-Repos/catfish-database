import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { Form } from 'src/components/ui/form'
import { Text } from 'src/components/ui/text'
import { newFishBatchResponseSchema, fishBatchSchema } from 'src/schemas'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { fishBatchResponseType } from 'src/types/ponds.types'
import { z } from 'zod'
import EditBatchDetailsForm from './edit-batch-form'

type BatchData = z.infer<typeof fishBatchSchema>

type DetailsPageProps = {
  batch: fishBatchResponseType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditBatchDetails({ open, batch, onOpenChange }: DetailsPageProps) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<ClientErrorType | null>(null)

  const queryClient = useQueryClient()

  const initialValues = {
    quantity: batch?.quantity || '',
    costOfSupply: batch?.costOfSupply || '',
    singleCost: String(Number(batch?.costOfSupply) / Number(batch?.quantity)) || '',
    active: batch?.active ?? true,
  }

  const form = useForm<BatchData>({
    resolver: zodResolver(fishBatchSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  })

  const useUpdateBatch = createPutMutationHook({
    endpoint: `fish-batches/${batch?.id}`,
    requestSchema: fishBatchSchema,
    responseSchema: newFishBatchResponseSchema,
  })

  const updateBatchMutation = useUpdateBatch()

  const onSubmit = async (values: z.infer<typeof fishBatchSchema>) => {
    try {
      setError(null)
      await updateBatchMutation.mutateAsync({
        ...values,
      })
      // latestQuantity isn't updated
      queryClient.refetchQueries(['my-fish-batches'])
      setStep(2)
    } catch (error) {
      console.error(error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
            errors: errorData.errors ?? null,
          })
        }
        console.error(error)
      }
    }
  }

  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <EditBatchDetailsForm
                setOpen={() => onOpenChange(false)}
                form={form}
                error={error}
                loading={updateBatchMutation.isLoading}
              />
            </form>
          </Form>
        )
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Batch updated successfully!</Text>
            <Button
              variant="primary"
              onClick={() => {
                onOpenChange(false)
                setTimeout(() => {
                  setStep(1)
                }, 1000)
              }}
            >
              Continue
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const quantity = form.watch('quantity')
  const singleCost = form.watch('singleCost')
  const total = String(Number(singleCost) * Number(quantity) || 0)
  const isValidCost = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value)

  useEffect(() => {
    if (isValidCost(total)) {
      form.setValue('costOfSupply', total)
    }
  }, [form.setValue, total])

  // setValue sets new values after change but no save
  // This resets batch values if dialog is opened again/updated
  useEffect(() => {
    if (open && batch) {
      const newInitialValues = {
        quantity: batch.quantity || '',
        costOfSupply: batch.costOfSupply || '',
        singleCost: String(Number(batch.costOfSupply) / Number(batch.quantity)) || '',
        active: batch.active ?? true,
      }
      form.reset(newInitialValues)
    }
  }, [open, batch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-h-[40rem] min-w-fit overflow-hidden ${step === 1 && '!overflow-y-scroll'} px-8 py-4`}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <>
          <VisuallyHidden>
            <DialogTitle>Edit Fish Batch Details</DialogTitle>
            <DialogDescription>This prompt edits fish batch details</DialogDescription>
          </VisuallyHidden>
          {renderSteps()}
        </>
      </DialogContent>
    </Dialog>
  )
}
