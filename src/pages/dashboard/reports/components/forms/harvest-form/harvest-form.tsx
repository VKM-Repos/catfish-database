'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { harvestSchema } from 'src/schemas'
import { z } from 'zod'
// Import useEffect
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from 'src/routes'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { LoadingScreen } from 'src/components/global/loading-screen'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'

type HarvestFormValues = z.infer<typeof harvestSchema>

export function HarvestForm({ handlePrevious }: { handlePrevious: () => void; handleNext: () => void }) {
  const navigate = useNavigate()
  const [error, setError] = useState<ClientErrorType | null>()
  const { id } = useParams<{ id: string }>()

  const useSamplingReport = createPostMutationHook({
    endpoint: '/samplings',
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  const form = useForm<z.infer<typeof harvestSchema>>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      numberOfFishHarvested: '',
      totalWeightHarvested: '',
      costPerKg: '',
    },
  })

  const { reset } = form
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})
  const [openDialog, setOpenDialog] = useState(false)

  const createSamplingReport = useSamplingReport()

  const onSubmit = async (data: z.infer<typeof harvestSchema>) => {
    try {
      const harvestData = {
        pondId: id,
        harvestCreate: {
          quantity: Number(data.numberOfFishHarvested),
          totalWeightHarvested: Number(data.totalWeightHarvested),
          costPerKg: Number(data.costPerKg),
        },
      }
      await createSamplingReport.mutateAsync(harvestData)
      setOpenDialog(true)
    } catch (err) {
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
  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }
  const handleIncrement = (fieldName: keyof HarvestFormValues) => {
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (!isNaN(currentValue)) {
      const newValue = (currentValue + 1).toString()
      form.setValue(fieldName, newValue)
    }
  }

  const handleDecrement = (fieldName: keyof HarvestFormValues) => {
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (!isNaN(currentValue) && currentValue > 0) {
      const newValue = (currentValue - 1).toString()
      form.setValue(fieldName, newValue)
    }
  }
  if (createSamplingReport.isLoading) {
    return <LoadingScreen />
  }
  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <div className="p-5">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Harvest Report</h5>
              <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
            </div>
            <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5">
              <div className="flex w-full items-center gap-5">
                <div className="flex w-full flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Number of Fish Harvested
                    <SolarIconSet.QuestionCircle size={16} />
                    <Text className="font-light text-neutral-500">(Optional)</Text>
                  </Text>
                  <FormField
                    control={form.control}
                    name="numberOfFishHarvested"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={
                              'focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
                            }
                          >
                            <div className="w-full">
                              <Input
                                placeholder="Input number of fish harvested"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '')
                                  field.onChange(value)
                                }}
                                className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                            <div
                              className={
                                'flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs'
                              }
                            >
                              <SolarIconSet.AltArrowUp
                                onClick={() => handleIncrement('numberOfFishHarvested')}
                                className="cursor-pointer"
                              />
                              <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200 " />
                              <SolarIconSet.AltArrowDown
                                onClick={() => handleDecrement('numberOfFishHarvested')}
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Total weight Harvested
                    <SolarIconSet.QuestionCircle size={16} />
                    <Text className="font-light text-neutral-500">(Optional)</Text>
                  </Text>
                  <FormField
                    control={form.control}
                    name="totalWeightHarvested"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Weight Harvested" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-5">
                <div className="flex w-full flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Total amount sold
                    <span className="font-bold text-red-500">*</span>
                    <SolarIconSet.QuestionCircle size={16} />
                    {/* <Text className="font-light text-neutral-500">(Optional)</Text> */}
                  </Text>
                  <FormField
                    control={form.control}
                    name="costPerKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                              activeInputs.totalAmountSold ? 'bg-neutral-100' : ''
                            } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                          >
                            <div
                              className={`h-10 rounded-bl-md rounded-tl-md px-3 py-[.65rem] text-xs ${
                                activeInputs.totalAmountSold
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-neutral-100 text-neutral-400'
                              }`}
                            >
                              &#8358;
                            </div>
                            <div className="w-full">
                              <Input
                                placeholder="Amount in naira"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '')
                                  field.onChange(value)
                                  handleInputChange('totalAmountSold', value)
                                }}
                                className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-neutral-100 p-5">
            <Button variant={'outline'} onClick={() => navigate(paths.dashboard.home.getStarted)}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
