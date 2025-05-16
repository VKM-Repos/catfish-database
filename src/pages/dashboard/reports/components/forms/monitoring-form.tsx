import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { dailyFeedingSchema, dailyWaterQualitySchema } from 'src/schemas'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import DailyFeedingDetailsForm from './daily-feeding-details-form'
import DailyWaterQuality from './daily-water-quality'
import { useState } from 'react'
import { CreateReportDialog } from '../modals/create-report-modal'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from 'src/routes'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { LoadingScreen } from 'src/components/global/loading-screen'

// Create combined type for the form
type CombinedFormData = z.infer<typeof dailyFeedingSchema> & z.infer<typeof dailyWaterQualitySchema>

export default function MonitoringForm() {
  const { id } = useParams<{ id: string }>()
  const useCreateDailyFeeding = createPostMutationHook({
    endpoint: '/feedings',
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  const useCreateWaterQuality = createPostMutationHook({
    endpoint: '/water-quality',
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  const [openDialog, setOpenDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const form = useForm<CombinedFormData>({
    resolver: zodResolver(dailyFeedingSchema.merge(dailyWaterQualitySchema)),
    defaultValues: {
      feedType: '',
      pelletSize: '',
      feedQuantity: 0,
      feedTime: '',
      dissolvedOxygen: '',
      phLevel: '',
      temperature: '',
      ammonia: '',
      nitrite: '',
      nitrate: '',
      alkalinity: '',
      hardness: '',
      // observation: '',
    },
    mode: 'onChange',
  })

  const { reset } = form
  const createDailyFeeding = useCreateDailyFeeding()
  const createWaterQuality = useCreateWaterQuality()

  const onSubmit = async (values: CombinedFormData) => {
    console.log('SUbmit')

    setIsSubmitting(true)
    try {
      // Separate the data for each endpoint
      const feedingData = {
        pondId: id,
        feedType: values.feedType,
        pelletSize: values.pelletSize ? Number(values.pelletSize.replace('mm', '')) : null,
        quantity: Number(values.feedQuantity),
        // feedTime: values.feedTime,
      }

      const waterQualityData = {
        pondId: id,
        dissolvedOxygen: values.dissolvedOxygen ? Number(values.dissolvedOxygen) : 0.1,
        phLevel: values.phLevel ? Number(values.phLevel) : 0.1,
        temperature: values.temperature ? Number(values.temperature) : 0.1,
        ammonia: values.ammonia ? Number(values.ammonia) : 0.1,
        nitrite: values.nitrite ? Number(values.nitrite) : 0.1,
        // nitrate: values.nitrate,
        alkalinity: values.alkalinity ? Number(values.alkalinity) : 0.1,
        hardness: values.hardness ? Number(values.hardness) : 0.1,
        frequency: 'DAILY',
        observation: 'EXCELLENT',
      }

      // Submit to both endpoints in parallel
      await Promise.all([createDailyFeeding.mutateAsync(feedingData), createWaterQuality.mutateAsync(waterQualityData)])

      setOpenDialog(true)
    } catch (error) {
      console.error('Submission error:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }
  if (createDailyFeeding.isLoading || createWaterQuality.isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 pb-0.5">
          {/* Daily Feeding Section */}
          <div className="flex w-full flex-col items-start gap-1">
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Feeding</h5>
              <p className="text-xs font-medium">
                Log today&lsquo;s feed type, amount, and feeding time to track your fish nutrition
              </p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-neutral-300 py-5">
            <DailyFeedingDetailsForm form={form} />
          </div>

          {/* Water Quality Section */}
          <div className="mb-2 w-full items-start">
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Water Quality</h5>
              <p className="text-xs font-medium">Record key water parameters to monitor pond health.</p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-neutral-300 py-5">
            <DailyWaterQuality form={form} />
          </div>

          {/* Form Actions */}
          <div className="mb-5 mt-10 flex w-full justify-between bg-neutral-100 px-5 py-3">
            <Button
              type="button"
              onClick={() => navigate(paths.dashboard.home.getStarted)}
              variant="outline"
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
