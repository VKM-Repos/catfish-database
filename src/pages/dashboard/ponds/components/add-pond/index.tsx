import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'
import AddPondDetailsForm from './add-pond-details-form'
import AddPondLocationForm from './add-pond-location-form'
import { Button } from 'src/components/ui/button'
import { usePondStore } from 'src/store/pond.store'

type PondData = z.infer<typeof pondSchema>

export default function AddPond({ handleNext }: { handleNext: () => void }) {
  const { pondData, setPondStore } = usePondStore()

  const form = useForm<PondData>({
    resolver: zodResolver(pondSchema),
    defaultValues: {
      name: '',
      size: '',
      waterSource: '',
      type: '',
      clusterId: 'abia-cluster',
      longitude: '',
      latitude: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: z.infer<typeof pondSchema>) => {
    try {
      setPondStore({
        ...pondData,
        name: values.name,
        size: values.size,
        waterSource: values.waterSource,
        type: values.type,
        clusterId: values.clusterId,
        longitude: values.longitude,
        latitude: values.latitude,
      })
      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
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
