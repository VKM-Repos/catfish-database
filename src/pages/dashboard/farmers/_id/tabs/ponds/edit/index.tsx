import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import UpdatePondForm from 'src/pages/dashboard/ponds/_id/edit/update-pond-form'
import { z } from 'zod'
import { pondResponseSchema, pondSchema } from 'src/schemas'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { Form } from 'src/components/ui/form'
import { useQueryClient } from '@tanstack/react-query'
import { pondResponseType } from 'src/types/ponds.types'

type PondData = z.infer<typeof pondSchema>

type UpdatePondPageProps = {
  pond: pondResponseType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdatePondPage({ pond, open, onOpenChange }: UpdatePondPageProps) {
  const [step, setStep] = useState(1)

  const queryClient = useQueryClient()

  const initialValues = {
    id: pond?.id || '',
    name: pond?.name || '',
    size: pond?.size || '',
    latitude: pond?.latitude || '',
    longitude: pond?.longitude || '',
    waterSource: pond?.waterSource || '',
    pondType: pond?.pondType || '',
    status: 'Active',
    clusterId: pond?.cluster?.id || '',
  }

  const form = useForm<PondData>({
    resolver: zodResolver(pondSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  })

  const [error, setError] = useState<ClientErrorType | null>(null)

  const useUpdatePond = createPutMutationHook({
    endpoint: `/ponds/${initialValues?.id}`,
    requestSchema: pondSchema,
    responseSchema: pondResponseSchema,
  })

  const updatePondMutation = useUpdatePond()

  const onSubmit = async (values: z.infer<typeof pondSchema>) => {
    try {
      setError(null)
      await updatePondMutation.mutateAsync({
        ...values,
      })
      queryClient.refetchQueries(['all-ponds'])
      queryClient.refetchQueries(['farmer-details'])
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
              <UpdatePondForm
                setOpen={() => onOpenChange(false)}
                form={form}
                error={error}
                loading={updatePondMutation.isLoading}
              />
            </form>
          </Form>
        )
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Pond updated successfully!</Text>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        asChild
        onClick={() => {
          onOpenChange(true)
        }}
      >
        Edit Pond
      </DialogTrigger>
      <DialogContent
        className={`max-h-[40rem] min-w-fit overflow-hidden ${step === 1 && '!overflow-y-scroll'} px-8 py-4`}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        {renderSteps()}
      </DialogContent>
    </Dialog>
  )
}
