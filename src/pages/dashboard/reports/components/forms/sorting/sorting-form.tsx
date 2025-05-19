'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from 'src/components/ui/form'
import { Switch } from 'src/components/ui/switch'
import { sortingSchema } from 'src/schemas'
import { z } from 'zod'
import { useState } from 'react'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { RadioGroup, RadioGroupItem } from 'src/components/ui/radio-group'
import TransferForm from './transfer-form'
import FishHarvestForm from './fish-harvest-form'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { useParams } from 'react-router-dom'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { ConfirmSamplingSubmission } from '../../modals/confirm-sampling-submission'

export function SortingForm({ handlePrevious }: { handlePrevious: () => void; handleNext: () => void }) {
  const { id } = useParams<{ id: string }>()
  const [error, setError] = useState<ClientErrorType | null>()
  const useSamplingReport = createPostMutationHook({
    endpoint: '/samplings',
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
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
  } = useFishSamplingStore()

  const samplingForm = {
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
  }
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof sortingSchema> | null>(null)
  const [samplingData, setSamplingData] = useState<any>(null)

  const form = useForm<z.infer<typeof sortingSchema>>({
    resolver: zodResolver(sortingSchema),
    defaultValues: {
      splitOccur: false,
      reason: undefined,
      batches: [],
    },
    mode: 'onChange',
  })

  const splitOccur = form.watch('splitOccur')
  const reason = form.watch('reason')

  const createSamplingReport = useSamplingReport()

  const validateForm = (data: z.infer<typeof sortingSchema>) => {
    // Validate reason is required when split occurs
    if (data.splitOccur && !data.reason) {
      form.setError('reason', {
        type: 'manual',
        message: 'Reason is required when split occurs',
      })
      return false
    }

    // Additional validation for transfer
    if (data.reason === 'transfer') {
      // Validate at least one batch exists
      if (!data.batches || data.batches.length === 0) {
        form.setError('batches', {
          type: 'manual',
          message: 'At least one batch is required for transfer',
        })
        return false
      }

      // Validate each batch has destinationPond and numberOfFishMoved
      const invalidBatches = data.batches.filter((batch) => !batch.pondId || !batch.quantity)

      if (invalidBatches.length > 0) {
        form.setError('batches', {
          type: 'manual',
          message: 'All batches must have destination pond and number of fish moved',
        })
        return false
      }
    }
    return true
  }

  const prepareSamplingData = (data: z.infer<typeof sortingSchema>) => {
    return {
      pondId: id,
      census: 12,
      sample: Number.parseInt(samplingForm.numberOfFishSampled),
      weight: 10,
      mortality: Number.parseInt(samplingForm.numberOfFishMortalityRecorded),
      averageWeightToFish: Number.parseInt(samplingForm.avgWeightFishSampled),
      weightGain: Number.parseInt(samplingForm.totalWeightGain),
      feedConsumed: Number.parseInt(samplingForm.totalFeedConsumed),
      behaviourObserve: samplingForm.observation,
      diseaseObserve: samplingForm.diseaseObservation,
      diseaseType: samplingForm.disease,
      behaviorType: samplingForm.behavior,
      splitOccur: data.splitOccur,
      reason: data.reason?.toUpperCase(),
      splitInfo: {
        batches: data.batches?.map((batch) => ({
          ...batch,
          quantity: Number(batch.quantity),
        })),
      },
    }
  }

  const onSubmit = async (data: z.infer<typeof sortingSchema>) => {
    if (!validateForm(data)) return

    setFormData(data)
    const preparedData = prepareSamplingData(data)
    setSamplingData(preparedData)
    setOpenConfirmDialog(true)
  }

  const handleConfirmSubmission = async () => {
    try {
      if (!samplingData) return

      await createSamplingReport.mutateAsync(samplingData)
      setOpenConfirmDialog(false)
      setOpenDialog(true)
    } catch (err) {
      setOpenConfirmDialog(false)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

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

  if (createSamplingReport.isLoading) {
    return <LoadingScreen />
  }
  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={form.reset} onOpenChange={setOpenDialog} />
      <ConfirmSamplingSubmission open={openConfirmDialog} onOpenChange={handleConfirmSubmission} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Split occurrence</h5>
              <p className="text-xs font-medium">
                Indicate if you&apos;ve split the batch today whether harvesting some or moving fish to new ponds—and
                capture the details.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-neutral-200 p-5">
              <FormField
                control={form.control}
                name="splitOccur"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start justify-between shadow-sm">
                    <div className="space-y-0.5">
                      <FormDescription className="flex items-center gap-1">
                        Did split occur during sampling? <span className="text-xl text-error-500">*</span>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span>No</span>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span>Yes</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {splitOccur && (
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Reason for split: <span className="text-xl text-error-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-2"
                          required
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">Transfer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="harvest" />
                            </FormControl>
                            <FormLabel className="font-normal">Harvest</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      {form.formState.errors.reason && (
                        <p className="text-sm font-medium text-error-500">{form.formState.errors.reason.message}</p>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>

            {splitOccur && reason && (
              <div className="mt-10">
                {reason === 'transfer' && (
                  <div>
                    <TransferForm form={form} />
                    {form.formState.errors.batches && (
                      <p className="text-sm font-medium text-error-500">{form.formState.errors.batches.message}</p>
                    )}
                  </div>
                )}
                {reason === 'harvest' && (
                  <div>
                    <FishHarvestForm form={form} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between bg-neutral-100 p-5">
            <Button variant={'outline'} onClick={handlePrevious}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
