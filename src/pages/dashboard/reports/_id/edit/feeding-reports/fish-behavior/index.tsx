import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { useDailyFeedingStore } from 'src/store/daily-feeding-store'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { UpdateReportDialog } from '../../components/update-report-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from 'src/components/ui/card'
import { fishBehaviorSchema } from 'src/schemas'

export function UpdateFishBehavior({ handleGoBack }: { handleGoBack: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const reportTime = new Date(location.state.report.time)
  const [date, setDate] = useState(reportTime.toISOString().split('T')[0])
  const [time, setTime] = useState(
    `${String(reportTime.getHours()).padStart(2, '0')}:${String(reportTime.getMinutes()).padStart(2, '0')}`,
  )
  const [error, setError] = useState<ClientErrorType | null>()
  const [openDialog, setOpenDialog] = useState(false)

  const [combinedDateTime, setCombinedDateTime] = useState(location.state.report.time + '.000Z')
  const timeInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const { activeInputs, setFormData, setActiveInput, reset: resetStore, reportId } = useDailyFeedingStore()
  const [recordDailyFeeding, setRecordDailyReport] = useState(true)

  const useUpdateFishBehavior = createPutMutationHook({
    endpoint: `/behaviors/${location.state.report.id}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const updateFishBehavior = useUpdateFishBehavior()

  const form = useForm<z.infer<typeof fishBehaviorSchema>>({
    resolver: zodResolver(fishBehaviorSchema),
    defaultValues: location.state.report,
  })

  const onSubmit = async (data: z.infer<typeof fishBehaviorSchema>) => {
    try {
      const updateFishBehaviorData = {
        behaviorType: data.behaviorType,
        behaviorTypeObservation: data.observation,
        frequency: 'DAILY',
        time: combinedDateTime,
      }
      await updateFishBehavior.mutateAsync(updateFishBehaviorData)
      queryClient.refetchQueries(['fish-behavior'])
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDate(newDate)
    updateCombinedDateTime(newDate, time)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    updateCombinedDateTime(date, newTime)
  }

  const updateCombinedDateTime = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      const combined = `${dateStr}T${timeStr}:00.000Z`
      setCombinedDateTime(combined)
    }
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
  const behaviors = [
    { value: 'NORMAL_ACTIVITY', text: 'Normal Activity' },
    { value: 'LETHARGIC_SLOW_MOVEMENT', text: 'Lethargic/Slow Movement' },
    { value: 'GASPING_AT_SURFACE', text: 'Gasping at Surface (Air Gulping)' },
    { value: 'ERRATIC_SPINNING_SWIMMING', text: 'Erratic/Spinning Swimming' },
    { value: 'FLASHING_RUBBING_SURFACES', text: 'Flashing/Rubbing Against Surfaces' },
    { value: 'LOSS_OF_APPETITE', text: 'Loss of Appetite' },
    { value: 'INCREASED_AGGRESSION', text: 'Increased Aggression/Fin Nipping' },
    { value: 'SCHOOLING_CLUMPING', text: 'Schooling/Clumping Together' },
    { value: 'ISOLATION_FROM_SCHOOL', text: 'Isolation from School' },
    { value: 'ABNORMAL_FLOATING_SINKING', text: 'Abnormal Floating/Sinking' },
  ]
  return (
    <>
      <UpdateReportDialog open={openDialog} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <FlexBox direction="row" justify="between" align="center" className="mb-10 border-0 border-b pb-5">
              {recordDailyFeeding ? (
                <div>
                  <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish behavior Report</h5>
                  <p className="text-xs font-medium">
                    {' '}
                    Score and describe fish activity (e.g., feeding response, swimming patterns) to detect stress or
                    health issues.
                  </p>
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
                          value={date}
                          onChange={handleDateChange}
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

                      <div
                        className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                          activeInputs.feedTime ? 'bg-primary-100' : ''
                        } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                      >
                        <div className="w-full">
                          <Input
                            data-placeholder={'Select Time'}
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            ref={timeInputRef}
                            className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                          />
                        </div>
                        <div
                          className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                            activeInputs.feedTime ? 'bg-primary-500 text-white' : 'bg-primary-500 text-white'
                          }`}
                          onClick={handleIconClick}
                        >
                          <SolarIconSet.ClockCircle />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FlexBox>
            {recordDailyFeeding && (
              <Card className="p-[24px]">
                <FlexBox gap="gap-2" direction="col" justify="start" className="w-full space-y-3">
                  <div className="flex w-full items-start gap-5">
                    <div className="flex w-full flex-col gap-2">
                      <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        Behavior
                        <span className="font-bold text-red-500">*</span>
                        <SolarIconSet.QuestionCircle size={16} />
                      </Text>
                      <FormField
                        control={form.control}
                        name="behaviorType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value ? String(field.value) : ''}
                                onValueChange={(value) => {
                                  field.onChange(value)
                                }}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="font-light">
                                  <div className="flex items-center justify-center gap-2">
                                    <SelectValue placeholder="Select Disease found" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {behaviors?.map((behavior) => (
                                    <SelectItem
                                      className="border border-l-0 border-r-0 border-t-0 border-neutral-200"
                                      key={behavior?.value}
                                      value={behavior?.value}
                                    >
                                      {behavior?.text}
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
                        Observation
                        <span className="font-bold text-red-500">*</span>
                        <SolarIconSet.QuestionCircle size={16} />
                      </Text>
                      <FormField
                        control={form.control}
                        name="observation"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="focus-within:ring-offset-background flex max-h-fit w-full items-center rounded-md border border-neutral-200 px-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                                <span>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M9.11965 1.43408H10.8803C12.4118 1.43407 13.6248 1.43406 14.5742 1.56169C15.5512 1.69305 16.342 1.96982 16.9656 2.59345C17.5893 3.21709 17.866 4.00788 17.9974 4.9849C18.125 5.93424 18.125 7.14727 18.125 8.67874V12.1061C18.125 13.6376 18.125 14.8506 17.9974 15.7999C17.866 16.777 17.5893 17.5677 16.9656 18.1914C16.342 18.815 15.5512 19.0918 14.5742 19.2231C13.6248 19.3508 12.4118 19.3508 10.8803 19.3507H9.11966C7.58819 19.3508 6.37516 19.3508 5.42581 19.2231C4.4488 19.0918 3.65801 18.815 3.03437 18.1914C2.41073 17.5677 2.13397 16.777 2.00261 15.7999C1.87498 14.8506 1.87499 13.6376 1.875 12.1061V8.67873C1.87499 7.14727 1.87498 5.93424 2.00261 4.9849C2.13397 4.00788 2.41073 3.21709 3.03437 2.59345C3.65801 1.96982 4.4488 1.69305 5.42581 1.56169C6.37516 1.43406 7.58819 1.43407 9.11965 1.43408ZM5.59237 2.80055C4.75397 2.91327 4.27093 3.12466 3.91825 3.47733C3.56558 3.83001 3.35419 4.31305 3.24147 5.15146C3.12633 6.00784 3.125 7.13673 3.125 8.72575V12.0591C3.125 13.6481 3.12633 14.777 3.24147 15.6334C3.35419 16.4718 3.56558 16.9548 3.91825 17.3075C4.27093 17.6602 4.75397 17.8716 5.59237 17.9843C6.44876 18.0994 7.57765 18.1007 9.16667 18.1007H10.8333C12.4224 18.1007 13.5512 18.0994 14.4076 17.9843C15.246 17.8716 15.7291 17.6602 16.0817 17.3075C16.4344 16.9548 16.6458 16.4718 16.7585 15.6334C16.8737 14.777 16.875 13.6481 16.875 12.0591V8.72575C16.875 7.13673 16.8737 6.00784 16.7585 5.15146C16.6458 4.31305 16.4344 3.83001 16.0817 3.47733C15.7291 3.12466 15.246 2.91327 14.4076 2.80055C13.5512 2.68541 12.4224 2.68408 10.8333 2.68408H9.16667C7.57765 2.68408 6.44876 2.68541 5.59237 2.80055ZM6.04167 7.05908C6.04167 6.7139 6.32149 6.43408 6.66667 6.43408H13.3333C13.6785 6.43408 13.9583 6.7139 13.9583 7.05908C13.9583 7.40426 13.6785 7.68408 13.3333 7.68408H6.66667C6.32149 7.68408 6.04167 7.40426 6.04167 7.05908ZM6.04167 10.3924C6.04167 10.0472 6.32149 9.76742 6.66667 9.76742H13.3333C13.6785 9.76742 13.9583 10.0472 13.9583 10.3924C13.9583 10.7376 13.6785 11.0174 13.3333 11.0174H6.66667C6.32149 11.0174 6.04167 10.7376 6.04167 10.3924ZM6.04167 13.7257C6.04167 13.3806 6.32149 13.1007 6.66667 13.1007H10.8333C11.1785 13.1007 11.4583 13.3806 11.4583 13.7257C11.4583 14.0709 11.1785 14.3507 10.8333 14.3507H6.66667C6.32149 14.3507 6.04167 14.0709 6.04167 13.7257Z"
                                      fill="#444955"
                                    />
                                  </svg>
                                </span>
                                <Input
                                  placeholder="observation"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value)
                                  }}
                                  className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </FlexBox>
              </Card>
            )}
          </div>

          <div className="flex justify-between bg-neutral-100 p-5">
            <Button variant={'outline'} onClick={() => handleGoBack()}>
              Back
            </Button>
            <Button disabled={updateFishBehavior.isLoading} type="submit">
              {reportId ? 'Update' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
