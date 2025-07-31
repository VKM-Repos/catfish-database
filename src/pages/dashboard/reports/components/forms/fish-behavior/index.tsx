import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { fishBehaviorSchema } from 'src/schemas'
import { z } from 'zod'
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { FlexBox } from 'src/components/ui/flexbox'
import { Card } from 'src/components/ui/card'
import { Switch } from 'src/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { useDateStore } from 'src/store/report-date-store'
import { useFishBehaviorStore } from 'src/store/fish-behavior-store'
import { createPutMutationHook } from 'src/api/hooks/usePut'

export function FishBehavior({ handleNext, handlePrevious }: { handleNext?: () => void; handlePrevious?: () => void }) {
  const navigate = useNavigate()
  const [recordFishBehavior, setRecordFishBehavior] = useState(false)
  const timeInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<ClientErrorType | null>()
  const { id } = useParams<{ id: string }>()
  const { combineDateTime } = useDateStore()
  const {
    formData,
    activeInputs,
    reportId,
    setFormData,
    setActiveInput,
    setReportId,
    reset: resetStore,
  } = useFishBehaviorStore()

  const useFishBehavior = createPostMutationHook({
    endpoint: `/behaviors`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const createFishBehavior = useFishBehavior()

  const useUpdateFishBehavior = createPutMutationHook({
    endpoint: `/behaviors/${reportId}`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const updateFishBehavior = useUpdateFishBehavior()
  const form = useForm<z.infer<typeof fishBehaviorSchema>>({
    resolver: zodResolver(fishBehaviorSchema),
    defaultValues: formData,
    mode: 'onChange',
  })

  const { reset } = form
  const [openDialog, setOpenDialog] = useState(false)

  const onSubmit = async (data: z.infer<typeof fishBehaviorSchema>) => {
    console.log('hiy')

    try {
      const fishBehaviorData = {
        pondId: id,
        behaviorType: data.behaviorType,
        behaviorTypeObservation: data.observation,
        frequency: 'DAILY',
        time: combineDateTime,
      }
      const updateFishBehaviorData = {
        behaviorType: data.behaviorType,
        behaviorTypeObservation: data.observation,
        frequency: 'DAILY',
        time: combineDateTime,
      }
      if (reportId) {
        await updateFishBehavior.mutateAsync(updateFishBehaviorData)
        if (handleNext) {
          handleNext()
        }
      } else {
        const response = await createFishBehavior.mutateAsync(fishBehaviorData)
        setReportId(response?.id)
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
  const handleSwitchChange = (checked: boolean) => {
    setRecordFishBehavior(checked)
    if (!checked) {
      reset()
    } else if (reportId) {
      form.reset(formData)
    }
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
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Card className="p-[24px]">
            <div className="flex flex-col items-start space-y-[8px]">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Do you want to record daily fish behavior ? <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <Switch id="recordFishBehavior" checked={recordFishBehavior} onCheckedChange={handleSwitchChange} />
            </div>
          </Card>
          {recordFishBehavior && (
            <div className="border-0 border-b p-5">
              <Text className="text-[1.5rem] font-bold text-[#444955]">Fish Behavior</Text>
              <Text className="text-xs font-medium">
                Score and describe fish activity (e.g., feeding response, swimming patterns) to detect stress or health
                issues.
              </Text>
            </div>
          )}
          {recordFishBehavior && (
            <Card className="p-[24px]">
              <FlexBox gap="gap-2" direction="col" className="w-full space-y-3">
                <div className="flex w-full items-center gap-5">
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
                                setFormData({ behaviorType: value })
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
                            <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 px-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
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
                                placeholder="Other observations during sorting"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setFormData({ observation: value })
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
          <div className="flex justify-between bg-neutral-100 p-5">
            <Button type="button" variant={'outline'} onClick={handlePrevious}>
              Back
            </Button>
            {recordFishBehavior && (
              <Button
                disabled={createFishBehavior.isLoading || updateFishBehavior.isLoading || !combineDateTime}
                type="submit"
              >
                {reportId ? 'Update' : 'Continue'}
              </Button>
            )}
            {!recordFishBehavior && (
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
