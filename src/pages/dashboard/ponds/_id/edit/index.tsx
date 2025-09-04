import { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { pondResponseSchema, pondTypeEnum, waterSourceEnum } from 'src/schemas'
import { useNavigate } from 'react-router-dom'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import PondForm, { PondCreateData } from '../../create/add-pond/forms/pond-form'
import { Heading } from 'src/components/ui/heading'
import { z } from 'zod'

const useGetPond = createGetQueryHook<typeof pondResponseSchema, { id: string }>({
  endpoint: '/ponds/:id',
  responseSchema: pondResponseSchema,
  queryKey: ['pond-details-for-farmer'],
})

type UpdatePondPageProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: string
}

export default function UpdatePondPage({ open, onOpenChange, id }: UpdatePondPageProps) {
  const [step, setStep] = useState(1)

  const navigate = useNavigate()

  // const { id } = useParams<{ id: string }>()

  const { data: pond } = useGetPond({ route: { id: id! } })

  const toInitialValues = (p: z.infer<typeof pondResponseSchema>): Partial<PondCreateData> => ({
    name: p.name,
    size: p.size,
    length: p.length,
    breadth: p.breadth,
    height: p.height,
    status: p.status,
    longitude: p.longitude,
    latitude: p.latitude,
    clusterId: p.cluster.id,
    farmerId: p.farmer.id,
    // cast because we trust the backend – or you can add a runtime guard
    waterSource: p.waterSource as z.infer<typeof waterSourceEnum>,
    pondType: p.pondType as z.infer<typeof pondTypeEnum>,
  })
  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <div className="pb-[2rem] pt-[4rem] lg:w-full lg:min-w-[46.25rem]">
            <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
              <Heading className="text-center" level={6}>
                Edit pond info
              </Heading>
            </div>
            <PondForm
              mode="edit"
              pondId={id!}
              initialValues={pond ? toInitialValues(pond) : undefined}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          </div>
        )
      case 2:
        return (
          <div className="my-8 flex w-full flex-col items-center justify-center gap-4">
            <Text className="text-lg font-semibold">Pond updated successfully!</Text>
            <Button
              variant="primary"
              onClick={() => {
                navigate(-1)
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

  const handleSuccess = () => {
    setStep(2)
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-h-[40rem] w-[90%] overflow-hidden rounded-lg  lg:w-full lg:min-w-fit ${
          step === 1 && '!overflow-y-scroll'
        } px-8 py-4`}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        {renderSteps()}
      </DialogContent>
    </Dialog>
  )
}
