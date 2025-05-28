import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { samplingSchema } from 'src/schemas'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import SamplingWeightForm from 'src/pages/dashboard/reports/components/forms/sampling/sampling-weight-from'
import FeedConsumedForm from 'src/pages/dashboard/reports/components/forms/sampling/feed-consumed-form'
import MortalityRateForm from 'src/pages/dashboard/reports/components/forms/sampling/mortality-rate-form'
import DiseaseForm from 'src/pages/dashboard/reports/components/forms/sampling/disease-form'
import FishBehaviorForm from 'src/pages/dashboard/reports/components/forms/sampling/fish-bevahior-form'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useQueryClient } from '@tanstack/react-query'
import { Loader } from 'src/components/ui/loader'

type SamplingData = z.infer<typeof samplingSchema>

export default function UpdateSamplingReportForm({ setStep }: { setStep: (step: number) => void }) {
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [error, setError] = useState<ClientErrorType | null>(null)
  const queryClient = useQueryClient()

  const { state } = useLocation()

  const samplingData = state?.samplingData
  console.log(samplingData)

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
    defaultValues: samplingData
      ? {
          numberOfFishSampled: samplingData.sample ?? numberOfFishSampled,
          weightOfFishSampled: samplingData.weight ?? weightOfFishSampled,
          avgWeightFishSampled: samplingData.averageWeightToFish ?? avgWeightFishSampled,
          totalWeightGain: samplingData.weightGain ?? totalWeightGain,
          totalFeedConsumed: samplingData.feedConsumed ?? totalFeedConsumed,
          numberOfFishMortalityRecorded: samplingData.mortality ?? numberOfFishMortalityRecorded,
          disease: samplingData.diseaseType ?? disease,
          diseaseObservation: samplingData.diseaseObserve ?? diseaseObservation,
          behavior: samplingData.behaviorType ?? behavior,
          observation: samplingData.behaviourObserve ?? observation,
        }
      : {},
    mode: 'onChange',
  })

  // Check if samplingData is available when component mounts
  useEffect(() => {
    if (samplingData) {
      setIsDataLoaded(true)
    } else {
      // Redirect or handle missing data case
      navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)
    }
  }, [samplingData, navigate])

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

  const updateMutation = createPutMutationHook({
    endpoint: `/samplings/${samplingData.id}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })()
  const onSubmit = async (values: z.infer<typeof samplingSchema>) => {
    try {
      setError(null)

      const payload = {
        sample: values.numberOfFishSampled,
        weight: values.weightOfFishSampled,
        averageWeightToFish: values.avgWeightFishSampled,
        weightGain: values.totalWeightGain,
        feedConsumed: values.totalFeedConsumed,
        mortality: values.numberOfFishMortalityRecorded,
        diseaseType: values.disease,
        diseaseObserve: values.diseaseObservation,
        behaviorType: values.behavior,
        behaviourObserve: values.observation,
      }
      await updateMutation.mutateAsync(payload)
      queryClient.refetchQueries(['sampling-reports-table'])
      setStep(2)
      // console.log(values, 'new')
    } catch (err) {
      const axiosError = err as { response?: { data?: ServerErrorType } }
      const errorData = axiosError.response?.data
      if (errorData) {
        setError({
          title: errorData.error,
          message: errorData.message,
          errors: errorData.errors ?? null,
        })
      }
    }
  }

  const handleCancel = () => {
    reset()
    navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)
  }
  if (!isDataLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading sampling data...</p>
        {/* Or you could show a spinner */}
      </div>
    )
  }
  if (updateMutation.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader type="spinner" size={40} />
      </div>
    )
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 pb-0.5">
          <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
            <FlexBox justify="center" align="center" className="w-full">
              <Text className="text-xl font-semibold text-neutral-700">Edit Record</Text>
            </FlexBox>
          </div>
          {error && <FormValidationErrorAlert error={error} />}
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
