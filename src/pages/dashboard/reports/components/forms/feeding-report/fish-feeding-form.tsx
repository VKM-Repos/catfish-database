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
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from 'src/routes'
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

const initialValues = {
  feedType: '',
  pelletSize: '',
  feedQuantity: '',
  feedTime: '',
}

export function DailyFeeding({ handleNext }: { handleNext?: () => void }) {
  const navigate = useNavigate()
  const timeInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const { id } = useParams<{ id: string }>()
  const { selectedDate, setSelectedDate, setCombineDateTime } = useDateStore()
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
        feedingTime: data.combinedDateTime,
      }
      const updateFeedingData = {
        feedType: data.feedType?.toUpperCase(),
        pelletSize: data.pelletSize ? Number(data.pelletSize.replace('mm', '')) : null,
        quantity: Number(data.feedQuantity),
        feedingTime: data.combinedDateTime,
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

  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedDate(newDate) // Persist to store
  }
  // Single function to handle combined date-time
  const handleDateTimeChange = (date: string, time: string) => {
    if (date && time) {
      // Combine date and time into ISO format
      const combined = `${date}T${time}:00.000Z`
      setFormData({ combinedDateTime: combined })
      setCombineDateTime(combined)
      return combined
    }
    return null
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setSelectedDate(dateValue)
    const timeValue = form.getValues('feedTime')
    handleDateTimeChange(dateValue, timeValue)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    // form.setValue('feedTime', timeValue)
    handleDateTimeChange(selectedDate, timeValue)
  }
  const handleInputChange = (fieldName: string, value: string) => {
    const isActive = value.trim().length > 0
    setActiveInput(fieldName, isActive)
  }

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  const handleDateClick = () => {
    dateInputRef.current?.showPicker()
  }

  const handleReset = () => {
    resetStore()
    form.reset(initialValues)
  }
  const handleSwitchChange = (checked: boolean) => {
    setRecordDailyReport(checked)
    // Reset form when switch is turned off
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
    navigate(paths.dashboard.home.getStarted)
  }
  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={handleReset} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Card className="p-[24px]">
            <div className="flex flex-col items-start space-y-[8px]">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Do you want to record daily feeding report ? <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <Switch id="recordDailyFeeding" checked={recordDailyFeeding} onCheckedChange={handleSwitchChange} />
            </div>
          </Card>

          <div>
            <FlexBox direction="row" justify="between" align="center" className="mb-10 border-0 border-b pb-5">
              {recordDailyFeeding ? (
                <div>
                  <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Report</h5>
                  <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
                </div>
              ) : (
                <div />
              )}
              <div>
                <div className="flex items-center gap-5">
                  <div className="flex flex-col">
                    <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      Change Date <span className="font-bold text-red-500">*</span>
                    </Text>
                    <div
                      className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                        activeInputs.feedTime ? 'bg-primary-100' : ''
                      } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                    >
                      <div className="w-full">
                        <Input
                          data-placeholder={'Select date'}
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            handleDateChange(e)
                            handleInputChange('date', e.target.value)
                          }}
                          ref={dateInputRef}
                          className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      </div>
                      <div
                        className="flex h-10 cursor-pointer items-center rounded-br-md rounded-tr-md bg-primary-500 px-3 py-[.65rem] text-xs text-white"
                        onClick={handleDateClick}
                      >
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.5 14C18.0523 14 18.5 13.5523 18.5 13C18.5 12.4477 18.0523 12 17.5 12C16.9477 12 16.5 12.4477 16.5 13C16.5 13.5523 16.9477 14 17.5 14Z"
                            fill="white"
                          />
                          <path
                            d="M17.5 18C18.0523 18 18.5 17.5523 18.5 17C18.5 16.4477 18.0523 16 17.5 16C16.9477 16 16.5 16.4477 16.5 17C16.5 17.5523 16.9477 18 17.5 18Z"
                            fill="white"
                          />
                          <path
                            d="M13.5 13C13.5 13.5523 13.0523 14 12.5 14C11.9477 14 11.5 13.5523 11.5 13C11.5 12.4477 11.9477 12 12.5 12C13.0523 12 13.5 12.4477 13.5 13Z"
                            fill="white"
                          />
                          <path
                            d="M13.5 17C13.5 17.5523 13.0523 18 12.5 18C11.9477 18 11.5 17.5523 11.5 17C11.5 16.4477 11.9477 16 12.5 16C13.0523 16 13.5 16.4477 13.5 17Z"
                            fill="white"
                          />
                          <path
                            d="M7.5 14C8.05229 14 8.5 13.5523 8.5 13C8.5 12.4477 8.05229 12 7.5 12C6.94772 12 6.5 12.4477 6.5 13C6.5 13.5523 6.94772 14 7.5 14Z"
                            fill="white"
                          />
                          <path
                            d="M7.5 18C8.05229 18 8.5 17.5523 8.5 17C8.5 16.4477 8.05229 16 7.5 16C6.94772 16 6.5 16.4477 6.5 17C6.5 17.5523 6.94772 18 7.5 18Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5 1.75C7.91421 1.75 8.25 2.08579 8.25 2.5V3.26272C8.912 3.24999 9.64133 3.24999 10.4435 3.25H14.5564C15.3586 3.24999 16.088 3.24999 16.75 3.26272V2.5C16.75 2.08579 17.0858 1.75 17.5 1.75C17.9142 1.75 18.25 2.08579 18.25 2.5V3.32709C18.5099 3.34691 18.7561 3.37182 18.989 3.40313C20.1614 3.56076 21.1104 3.89288 21.8588 4.64124C22.6071 5.38961 22.9392 6.33855 23.0969 7.51098C23.25 8.65018 23.25 10.1058 23.25 11.9435V14.0564C23.25 15.8941 23.25 17.3498 23.0969 18.489C22.9392 19.6614 22.6071 20.6104 21.8588 21.3588C21.1104 22.1071 20.1614 22.4392 18.989 22.5969C17.8498 22.75 16.3942 22.75 14.5565 22.75H10.4436C8.60585 22.75 7.15018 22.75 6.01098 22.5969C4.83856 22.4392 3.88961 22.1071 3.14124 21.3588C2.39288 20.6104 2.06076 19.6614 1.90314 18.489C1.74997 17.3498 1.74998 15.8942 1.75 14.0564V11.9436C1.74998 10.1058 1.74997 8.65019 1.90314 7.51098C2.06076 6.33855 2.39288 5.38961 3.14124 4.64124C3.88961 3.89288 4.83856 3.56076 6.01098 3.40313C6.2439 3.37182 6.49006 3.34691 6.75 3.32709V2.5C6.75 2.08579 7.08579 1.75 7.5 1.75ZM6.21085 4.88976C5.20476 5.02502 4.62511 5.27869 4.2019 5.7019C3.77869 6.12511 3.52502 6.70476 3.38976 7.71085C3.36685 7.88123 3.3477 8.06061 3.33168 8.25H21.6683C21.6523 8.06061 21.6331 7.88124 21.6102 7.71085C21.475 6.70476 21.2213 6.12511 20.7981 5.7019C20.3749 5.27869 19.7952 5.02502 18.7892 4.88976C17.7615 4.75159 16.4068 4.75 14.5 4.75H10.5C8.59318 4.75 7.23851 4.75159 6.21085 4.88976ZM3.25 12C3.25 11.146 3.25032 10.4027 3.26309 9.75H21.7369C21.7497 10.4027 21.75 11.146 21.75 12V14C21.75 15.9068 21.7484 17.2615 21.6102 18.2892C21.475 19.2952 21.2213 19.8749 20.7981 20.2981C20.3749 20.7213 19.7952 20.975 18.7892 21.1102C17.7615 21.2484 16.4068 21.25 14.5 21.25H10.5C8.59318 21.25 7.23851 21.2484 6.21085 21.1102C5.20476 20.975 4.62511 20.7213 4.2019 20.2981C3.77869 19.8749 3.52502 19.2952 3.38976 18.2892C3.25159 17.2615 3.25 15.9068 3.25 14V12Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        Time <span className="font-bold text-red-500">*</span>
                      </Text>
                      <FormField
                        control={form.control}
                        name="feedTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div
                                className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                                  activeInputs.feedTime ? 'bg-primary-100' : ''
                                } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                              >
                                <div className="w-full">
                                  <Input
                                    data-placeholder={'Select Time'}
                                    type="time"
                                    {...field}
                                    onChange={(e) => {
                                      // field.onChange(e.target.value)
                                      handleInputChange('feedTime', e.target.value)
                                      setFormData({ feedTime: e.target.value })
                                      handleTimeChange(e)
                                    }}
                                    ref={timeInputRef}
                                    className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                                  />
                                </div>
                                <div
                                  className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                                    activeInputs.feedTime
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-neutral-100 text-neutral-400'
                                  }`}
                                  onClick={handleIconClick}
                                >
                                  <SolarIconSet.ClockCircle />
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
                <Text className="mt-2 text-sm text-error-500">
                  {!form.getValues('feedTime') && !form.getValues('combinedDateTime')
                    ? 'Select date time to continue'
                    : ''}
                </Text>
              </div>
            </FlexBox>
            {recordDailyFeeding && (
              <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5">
                <div className="flex w-full items-start gap-5">
                  <div className="flex w-full flex-col gap-2">
                    <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      Feed Type <span className="font-bold text-red-500">*</span>
                      <SolarIconSet.QuestionCircle size={16} />
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
                      <SolarIconSet.QuestionCircle size={16} />
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

                {/* <div className="flex w-[32%] flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Enter the Feeding Time <span className="font-bold text-red-500">*</span>
                    <SolarIconSet.QuestionCircle size={16} />
                  </Text>
                  <FormField
                    control={form.control}
                    name="feedTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                              activeInputs.feedTime ? 'bg-primary-100' : ''
                            } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                          >
                            <div className="w-full">
                              <Input
                                data-placeholder={'Select Time'}
                                type="time"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value)
                                  handleInputChange('feedTime', e.target.value)
                                  setFormData({ feedTime: e.target.value })
                                }}
                                ref={timeInputRef}
                                className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                              />
                            </div>
                            <div
                              className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                                activeInputs.feedTime ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'
                              }`}
                              onClick={handleIconClick}
                            >
                              <SolarIconSet.ClockCircle />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </div>
            )}
          </div>

          <div className="flex justify-between bg-neutral-100 p-5">
            <Button variant={'outline'} onClick={() => handleGoBack()}>
              Back
            </Button>
            {recordDailyFeeding && (
              <Button disabled={createDailyFeeding.isLoading || updateDailyFeeding.isLoading} type="submit">
                {reportId ? 'Update' : 'Continue'}
              </Button>
            )}
            {!recordDailyFeeding && (
              <Button disabled={!form.getValues('feedTime')} type="button" onClick={handleNext}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
