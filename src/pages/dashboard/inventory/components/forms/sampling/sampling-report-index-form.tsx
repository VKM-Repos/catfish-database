import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { samplingSchema } from 'src/schemas'
import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { useEffect, useState } from 'react'
import SamplingWeightForm from './sampling-weight-from'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import FeedConsumedForm from './feed-consumed-form'
import MortalityRateForm from './mortality-rate-form'
import DiseaseForm from './disease-form'
import FishBehaviorForm from './fish-bevahior-form'

type SamplingData = z.infer<typeof samplingSchema>

export default function SamplingIndexForm({
  handleNext,
  handlePrevious,
}: {
  handleNext: () => void
  handlePrevious: () => void
}) {
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)

  const {
    numberOfFishSampled,
    weightOfFishSampled,
    avgWeightFishSampled,
    totalWeightGain,
    totalFeedConsumed,
    numberOfFishMortalityRecorded,
    disease,
    diseaseObservation,
    behavior,
    observation,
    updateProperty,
    reset,
  } = useFishSamplingStore()

  const form = useForm<SamplingData>({
    resolver: zodResolver(samplingSchema),
    defaultValues: {
      numberOfFishSampled,
      weightOfFishSampled,
      avgWeightFishSampled,
      totalWeightGain,
      totalFeedConsumed,
      numberOfFishMortalityRecorded,
      disease,
      diseaseObservation,
      behavior,
      observation,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.entries(values).forEach(([key, value]) => {
          updateProperty(key as keyof SamplingData, value || '')
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, updateProperty])

  const onSubmit = async (values: z.infer<typeof samplingSchema>) => {
    try {
      console.log('Submitting:', values)

      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.entries(values).forEach(([key, value]) => {
        updateProperty(key as keyof SamplingData, value || '')
      })

      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    reset()
    navigate(paths.dashboard.home.getStarted)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 pb-0.5">
          <div className="w-full">
            <div className="mb-5 flex w-full flex-col items-start gap-1">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Sample Weight</h5>
                <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 p-5">
              <SamplingWeightForm form={form} />
            </div>
          </div>
          <div className="w-full ">
            <div className="mb-5 w-full items-start">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Feed consumed</h5>
                <p className="text-xs font-medium">
                  Enter the number of fish that died today to help you track survival rates.
                </p>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 p-5">
              <FeedConsumedForm form={form} />
            </div>
          </div>

          <div className="w-full ">
            <div className="mb-5 w-full items-start">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Mortality Rate</h5>
                <p className="text-xs font-medium">
                  Enter the number of fish that died today to help you track survival rates.
                </p>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 p-5">
              <MortalityRateForm form={form} />
            </div>
          </div>
          <div className="w-full ">
            <div className="mb-5 w-full items-start">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Diseases</h5>
                <p className="text-xs font-medium">
                  Note any disease symptoms or outbreaks observed, including treatments used.
                </p>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 p-5">
              <DiseaseForm form={form} />
            </div>
          </div>
          <div className="w-full ">
            <div className="mb-5 w-full items-start">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish Behavior</h5>
                <p className="text-xs font-medium">
                  Score and describe fish activity (e.g., feeding response, swimming patterns) to detect stress or
                  health issues.
                </p>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 p-5">
              <FishBehaviorForm form={form} />
            </div>
          </div>

          <div className="mb-5 mt-10 flex w-full justify-between bg-neutral-100 px-5 py-3">
            <Button type="button" onClick={handleCancel} variant="outline" className="flex items-center gap-2">
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
