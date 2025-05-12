import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { dailyFeedingSchema } from 'src/schemas'
import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import DailyFeedingDetailsForm from './daily-feeding-details-form'
import DailyWaterQuality from './daily-water-quality'
import { useState } from 'react'
import { CreateReportDialog } from '../modals/create-report-modal'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'

type PondData = z.infer<typeof dailyFeedingSchema>

export default function MonitoringForm({
  handleNext,
  handlePrevious,
}: {
  handleNext: () => void
  handlePrevious: () => void
}) {
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()

  const form = useForm<PondData>({
    resolver: zodResolver(dailyFeedingSchema),
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
      waterQualityObservation: '',
    },
    mode: 'onChange',
  })
  const { reset } = form
  const onSubmit = async (values: z.infer<typeof dailyFeedingSchema>) => {
    try {
      console.log(values)
      setOpenDialog(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8   pb-0.5">
          <div className="flex w-full flex-col items-start gap-1 ">
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Feeding</h5>
              <p className="text-xs font-medium">
                Log today’s feed type, amount, and feeding time to track your fish nutrition
              </p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-neutral-300 py-5">
            <DailyFeedingDetailsForm form={form} />
          </div>

          <div className="mb-2 w-full items-start">
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Water Quality</h5>
              <p className="text-xs font-medium">Record key water parameters to monitor pond health.</p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-neutral-300 py-5">
            <DailyWaterQuality form={form} />
          </div>

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
              disabled={!form.formState.isValid}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
