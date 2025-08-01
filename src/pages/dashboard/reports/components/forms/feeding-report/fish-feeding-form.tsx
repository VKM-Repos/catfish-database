import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { dailyFeedingSchema } from 'src/schemas'
import { z } from 'zod'
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { FlexBox } from 'src/components/ui/flexbox'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'
import { useDailyFeedingStore } from 'src/store/daily-feeding-store'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { useDateStore } from 'src/store/report-date-store'
import { Card } from 'src/components/ui/card'
import { Switch } from 'src/components/ui/switch'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { useSamplingStepperStore } from 'src/store/sampling-stepper-store'
import { useStepperStore } from 'src/store/daily-feeding-stepper-store'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import { useWaterQualityStore } from 'src/store/water-quality-store'
import { useFishBehaviorStore } from 'src/store/fish-behavior-store'
import { useFishDiseaseStore } from 'src/store/fish-disease-store'
import { useFarmerReportStore } from 'src/store/farmer-report-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/ui/tooltip'
import { CircularProgress } from '../../../create/daily-farm-report/_id'

const initialValues = {
  feedType: '',
  pelletSize: '',
  feedQuantity: '',
  feedTime: '',
}

export function DailyFeeding({ handleNext, handlePrevious }: { handleNext?: () => void; handlePrevious?: () => void }) {
  const timeInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const { id } = useParams<{ id: string }>()

  const { combineDateTime } = useDateStore()
  const { farmerIdForDailyReport } = useFarmerReportStore()

  const {
    formData,
    activeInputs,
    setFormData,
    setActiveInput,
    reset: resetStore,
    reportId,
    setReportId,
  } = useDailyFeedingStore()
  const [recordDailyFeeding, setRecordDailyReport] = useState(false)

  const useGetFeedInventory = createGetQueryHook({
    endpoint: '/feed-inventories',
    responseSchema: z.any(),
    queryKey: ['feed-inventory-report'],
  })
  const { data: feedInventory } = useGetFeedInventory()

  const useDailyFeeding = createPostMutationHook({
    endpoint: `/feedings`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const createDailyFeeding = useDailyFeeding()

  const useUpdateDailyFeeding = createPutMutationHook({
    endpoint: `/feedings/${reportId}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const updateDailyFeeding = useUpdateDailyFeeding()

  const form = useForm<z.infer<typeof dailyFeedingSchema>>({
    resolver: zodResolver(dailyFeedingSchema),
    defaultValues: formData,
  })
  const { reset } = form

  const [openDialog, setOpenDialog] = useState(false)
  const [error, setError] = useState<ClientErrorType | null>()
  const { reset: resetSamplingStepper } = useSamplingStepperStore()
  const { reset: resetDailyFeedingStepper } = useStepperStore()
  const { reset: resetSamplingForm } = useFishSamplingStore()
  const { reset: resetDailyFeeding } = useDailyFeedingStore()
  const { reset: resetWaterQuality } = useWaterQualityStore()
  const { reset: resetFishBehavior } = useFishBehaviorStore()
  const { reset: resetFishDisease } = useFishDiseaseStore()
  const { reset: resetStepper } = useStepperStore()
  // Sync form with store data on mount
  useEffect(() => {
    form.reset(formData)
  }, [form, formData])

  console.log(combineDateTime, 'combine')

  const onSubmit = async (data: z.infer<typeof dailyFeedingSchema>) => {
    try {
      setError(null)
      setFormData(data)
      const numbers = data.feedType.match(/\d+/g)
      data.pelletSize = numbers ? numbers.join('') : ''
      data.feedType = data.feedType.replace(/\d+/g, '')
      const feedingData = {
        pondId: id,
        feedType: data.feedType?.toUpperCase(),
        pelletSize: data.pelletSize ? Number(data.pelletSize.replace('mm', '')) : null,
        quantity: Number(data.feedQuantity),
        feedingTime: combineDateTime,
      }
      const updateFeedingData = {
        feedType: data.feedType?.toUpperCase(),
        pelletSize: data.pelletSize ? Number(data.pelletSize.replace('mm', '')) : null,
        quantity: Number(data.feedQuantity),
        feedingTime: combineDateTime,
      }
      if (reportId) {
        await updateDailyFeeding.mutateAsync(updateFeedingData)
        if (handleNext) {
          handleNext()
        }
      } else {
        const response = await createDailyFeeding.mutateAsync(feedingData)
        setReportId(response.id)
        if (handleNext) {
          handleNext()
        }
      }
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
    const isActive = value.trim().length > 0
    setActiveInput(fieldName, isActive)
  }

  const handleReset = () => {
    resetStore()
    form.reset(initialValues)
  }
  const handleSwitchChange = (checked: boolean) => {
    setRecordDailyReport(checked)
    if (!checked) {
      reset()
    }
  }
  const handleGoBack = () => {
    resetSamplingStepper()
    resetDailyFeedingStepper()
    resetSamplingForm()
    resetDailyFeeding()
    resetWaterQuality()
    resetFishBehavior()
    resetFishDisease()
    resetStepper()
    handlePrevious?.()
  }

  const FormTooltip = ({ text }: { text: string }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <SolarIconSet.QuestionCircle size={16} />
          </TooltipTrigger>
          <TooltipContent>{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={handleReset} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <div className="mt-5 flex gap-3 lg:hidden">
        <CircularProgress />
        <FlexBox direction="row" justify="between" align="center" className="">
          <div>
            <h5 className="text-[1.5rem] font-bold text-[#22252B]">Daily Report</h5>
            <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
          </div>
        </FlexBox>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Card className="p-[24px]">
            <div className="flex flex-col items-start space-y-[8px]">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Do you want to record daily feeding report ? <span className="font-bold text-red-500">*</span>
                <FormTooltip text="This will allow you to track daily feeding activities and fish growth." />
              </Text>
              <Switch id="recordDailyFeeding" checked={recordDailyFeeding} onCheckedChange={handleSwitchChange} />
            </div>
          </Card>

          <div>
            {recordDailyFeeding && (
              <FlexBox
                direction="row"
                justify="between"
                align="center"
                className="mb-10 hidden border-0 border-b pb-5 lg:flex"
              >
                <div>
                  <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Report</h5>
                  <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
                </div>
              </FlexBox>
            )}
            {recordDailyFeeding && (
              <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5">
                <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
                  <div className="flex w-full flex-col gap-2">
                    <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      Feed Type <span className="font-bold text-red-500">*</span>
                      <FormTooltip text="Select the type or brand of feed you are using, e.g., Skretting, Blue Crown, Top Feed. This helps track feed performance over time." />
                    </Text>
                    <FormField
                      control={form.control}
                      name="feedType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value || ''}
                              onValueChange={(value) => {
                                field.onChange(value)
                                setFormData({ feedType: value })
                              }}
                            >
                              <SelectTrigger className="font-light">
                                <div className="mt-2 flex gap-2">
                                  <div>
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.11965 1.04163H10.8803C12.4118 1.04161 13.6248 1.0416 14.5742 1.16924C15.5512 1.3006 16.342 1.57736 16.9656 2.201C17.5893 2.82463 17.866 3.61542 17.9974 4.59244C18.125 5.54179 18.125 6.75482 18.125 8.28628V11.7136C18.125 13.2451 18.125 14.4581 17.9974 15.4075C17.866 16.3845 17.5893 17.1753 16.9656 17.7989C16.342 18.4226 15.5512 18.6993 14.5742 18.8307C13.6248 18.9583 12.4118 18.9583 10.8803 18.9583H9.11966C7.58819 18.9583 6.37516 18.9583 5.42581 18.8307C4.4488 18.6993 3.65801 18.4226 3.03437 17.7989C2.41073 17.1753 2.13397 16.3845 2.00261 15.4075C1.87498 14.4581 1.87499 13.2451 1.875 11.7136V8.28628C1.87499 6.75481 1.87498 5.54179 2.00261 4.59244C2.13397 3.61542 2.41073 2.82463 3.03437 2.201C3.65801 1.57736 4.4488 1.3006 5.42581 1.16924C6.37516 1.0416 7.58819 1.04161 9.11965 1.04163ZM5.59237 2.40809C4.75397 2.52081 4.27093 2.7322 3.91825 3.08488C3.56558 3.43755 3.35419 3.92059 3.24147 4.759C3.12633 5.61539 3.125 6.74428 3.125 8.33329V11.6666C3.125 13.2556 3.12633 14.3845 3.24147 15.2409C3.35419 16.0793 3.56558 16.5624 3.91825 16.915C4.27093 17.2677 4.75397 17.4791 5.59237 17.5918C6.44876 17.707 7.57765 17.7083 9.16667 17.7083H10.8333C12.4224 17.7083 13.5512 17.707 14.4076 17.5918C15.246 17.4791 15.7291 17.2677 16.0817 16.915C16.4344 16.5624 16.6458 16.0793 16.7585 15.2409C16.8737 14.3845 16.875 13.2556 16.875 11.6666V8.33329C16.875 6.74428 16.8737 5.61539 16.7585 4.759C16.6458 3.92059 16.4344 3.43755 16.0817 3.08488C15.7291 2.7322 15.246 2.52081 14.4076 2.40809C13.5512 2.29295 12.4224 2.29163 10.8333 2.29163H9.16667C7.57765 2.29163 6.44876 2.29295 5.59237 2.40809ZM6.04167 6.66663C6.04167 6.32145 6.32149 6.04163 6.66667 6.04163H13.3333C13.6785 6.04163 13.9583 6.32145 13.9583 6.66663C13.9583 7.0118 13.6785 7.29163 13.3333 7.29163H6.66667C6.32149 7.29163 6.04167 7.0118 6.04167 6.66663ZM6.04167 9.99996C6.04167 9.65478 6.32149 9.37496 6.66667 9.37496H13.3333C13.6785 9.37496 13.9583 9.65478 13.9583 9.99996C13.9583 10.3451 13.6785 10.625 13.3333 10.625H6.66667C6.32149 10.625 6.04167 10.3451 6.04167 9.99996ZM6.04167 13.3333C6.04167 12.9881 6.32149 12.7083 6.66667 12.7083H10.8333C11.1785 12.7083 11.4583 12.9881 11.4583 13.3333C11.4583 13.6785 11.1785 13.9583 10.8333 13.9583H6.66667C6.32149 13.9583 6.04167 13.6785 6.04167 13.3333Z"
                                        fill="#444955"
                                      />
                                    </svg>
                                  </div>
                                  <SelectValue placeholder="Select Feed type" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {feedInventory?.content.map((feed: any) => (
                                  <SelectItem
                                    className="w-full items-center justify-between "
                                    key={feed.id}
                                    value={feed.type + feed.sizeInMm}
                                  >
                                    {''}
                                    <Text>
                                      {feed.type?.replace('_', ' ')} ({feed.sizeInMm}mm)
                                    </Text>
                                    <SelectSeparator />
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      Feed Quantity <span className="font-bold text-red-500">*</span>
                      <FormTooltip text="Enter the total amount of feed available in kilograms (kg). This will be used to monitor feed usage and calculate cost per kg." />
                    </Text>
                    <FormField
                      control={form.control}
                      name="feedQuantity"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div
                              className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border px-3 ${
                                activeInputs.feedQuantity ? 'bg-white' : ''
                              } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                            >
                              <SolarIconSet.Weigher />
                              <Input
                                placeholder="input quantity in kg"
                                {...field}
                                className="w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                onChange={(e) => {
                                  let value = e.target.value.replace(/[^0-9]/g, '')
                                  if (value.length > 1 && value.startsWith('0')) {
                                    value = value.replace(/^0+/, '')
                                  }
                                  field.onChange(value)
                                  handleInputChange('feedQuantity', value)
                                  setFormData({ feedQuantity: value })
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className=" flex justify-between bg-neutral-100 p-5 ">
            <Button variant={'outline'} onClick={() => handleGoBack()}>
              Back
            </Button>

            {recordDailyFeeding && (
              <Button
                disabled={createDailyFeeding.isLoading || updateDailyFeeding.isLoading || !combineDateTime}
                type="submit"
              >
                {reportId ? 'Update' : 'Continue'}
              </Button>
            )}
            {!recordDailyFeeding && (
              <Button onClick={handleNext} type="button">
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
