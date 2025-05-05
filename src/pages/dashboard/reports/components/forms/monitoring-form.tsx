import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { dailyFeedingSchema } from 'src/schemas'
import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import DailyFeedingDetailsForm from './daily-feeding-details-form'
import DailyWaterQuality from './daily-water-quality'

type PondData = z.infer<typeof dailyFeedingSchema>

export default function MonitoringForm({ handleNext }: { handleNext: () => void }) {
  const form = useForm<PondData>({
    resolver: zodResolver(dailyFeedingSchema),
    defaultValues: {
      feedType: '',
      feedQuantity: '',
      feedTime: '00:00',
      dissolvedOxygen: '',
      phLevel: '',
      temperature: '',
      ammonia: '',
      nitrite: '',
      nitrate: '',
      alkalinity: '',
      hardness: '',
      waterQualityObservation: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: z.infer<typeof dailyFeedingSchema>) => {
    try {
      console.log(values)
      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
        <div className="flex w-full flex-col items-start gap-1">
          <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Feeding</h5>
          <hr className="w-full border border-primary-200" />
        </div>
        <DailyFeedingDetailsForm form={form} />

        <div className="mb-2 w-full items-start">
          <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Water Quality</h5>
          <hr className="w-full border border-primary-200" />
        </div>
        <DailyWaterQuality form={form} />

        <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={!form.formState.isValid}>
          Continue
        </Button>
      </form>
    </Form>
  )
}
