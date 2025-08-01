import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { FlexBox } from 'src/components/ui/flexbox'
import { Card } from 'src/components/ui/card'
import { Switch } from 'src/components/ui/switch'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { useStepperStore } from 'src/store/daily-feeding-stepper-store'
import { mortalitySchema } from 'src/schemas'
import { useDateStore } from 'src/store/report-date-store'
import { useDailyFeedingStore } from 'src/store/daily-feeding-store'
import { useWaterQualityStore } from 'src/store/water-quality-store'
import { useFishBehaviorStore } from 'src/store/fish-behavior-store'
import { useFishDiseaseStore } from 'src/store/fish-disease-store'
import { CircularProgress } from '../../../create/daily-farm-report/_id'

type MortalityFormValues = z.infer<typeof mortalitySchema>
export function Mortality({ handleNext, handlePrevious }: { handleNext?: () => void; handlePrevious?: () => void }) {
  const [recordFishDisease, setRecordFishDisease] = useState(false)
  const timeInputRef = useRef<HTMLInputElement>(null)
  const { id } = useParams<{ id: string }>()
  const [error, setError] = useState<ClientErrorType | null>()
  const { reset: resetStepper } = useStepperStore()
  const { combineDateTime, resetDateTime } = useDateStore()
  const { reset: resetDailyFeeding } = useDailyFeedingStore()
  const { reset: resetWaterQuality } = useWaterQualityStore()
  const { reset: resetFishBehavior } = useFishBehaviorStore()
  const { reset: resetFishDisease } = useFishDiseaseStore()
  const useFishDisease = createPostMutationHook({
    endpoint: `/mortalities`,
    requestSchema: z.any(),
    responseSchema: z.any(),
  })
  const createFishDisease = useFishDisease()
  const form = useForm<z.infer<typeof mortalitySchema>>({
    resolver: zodResolver(mortalitySchema),
    defaultValues: {
      mortalityNumber: '',
    },
  })

  const { reset } = form
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})
  const [openDialog, setOpenDialog] = useState(false)

  const onSubmit = async (data: z.infer<typeof mortalitySchema>) => {
    try {
      const mortalityData = {
        pondId: id,
        mortalityNumber: data.mortalityNumber,
        frequency: 'DAILY',
        time: combineDateTime,
      }
      await createFishDisease.mutateAsync(mortalityData)
      resetDailyFeeding()
      resetWaterQuality()
      resetFishBehavior()
      resetFishDisease()
      resetDateTime()
      setOpenDialog(true)
      if (openDialog) {
        setInterval(() => {
          resetStepper()
        }, 2000)
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
    setRecordFishDisease(checked)
    // Reset form when switch is turned off
    if (!checked) {
      reset()
    }
  }
  const handleIncrement = (fieldName: keyof MortalityFormValues) => {
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    if (!isNaN(currentValue)) {
      const newValue = (currentValue + 1).toString()
      form.setValue(fieldName, newValue, { shouldValidate: true })
    }
  }

  const handleDecrement = (fieldName: keyof MortalityFormValues) => {
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    if (!isNaN(currentValue) && currentValue > 0) {
      const newValue = (currentValue - 1).toString()
      form.setValue(fieldName, newValue, { shouldValidate: true })
    }
  }
  const handleEmptyState = () => {
    setOpenDialog(true)
  }
  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      <div className="flex w-full justify-between gap-3 lg:hidden">
        <CircularProgress />
        <FlexBox direction="row" justify="between" align="center" className="min-w-[70%]">
          <div>
            <h5 className="text-[1.5rem] font-bold text-[#22252B]">Mortality</h5>
            <p className=" text-xs font-medium">
              Enter the number of fish that died today to help you track survival rates.
            </p>
          </div>
        </FlexBox>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Card className="p-[24px]">
            <div className="flex flex-col items-start space-y-[8px]">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Do you want to record mortality ? <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <Switch id="recordFishDisease" checked={recordFishDisease} onCheckedChange={handleSwitchChange} />
            </div>
          </Card>
          {recordFishDisease && (
            <div className="hidden border-0 border-b p-5 lg:inline">
              <Text className="text-[1.5rem] font-bold text-[#444955]">Mortality</Text>
              <Text className="text-xs font-medium">record mortality rate</Text>
            </div>
          )}
          {recordFishDisease && (
            <Card className="p-[24px]">
              <FlexBox gap="gap-2" direction="col" className="w-full space-y-3">
                <div className="w-full">
                  <div className="flex w-full flex-col gap-2">
                    <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      No of fish mortality recorded <span className="font-bold text-red-500">*</span>
                      <SolarIconSet.QuestionCircle size={16} />
                    </Text>
                    <FormField
                      control={form.control}
                      name="mortalityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="focus-within:ring-offset-background flex max-h-fit w-[50%] items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                              <div className="w-full">
                                <Input
                                  placeholder="Input number of Deaths recorded"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '') // Only allow numbers
                                    field.onChange(value)
                                  }}
                                  className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              <div className="flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs">
                                <SolarIconSet.AltArrowUp
                                  onClick={() => handleIncrement('mortalityNumber')}
                                  className="cursor-pointer hover:text-primary-500"
                                />
                                <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200" />
                                <SolarIconSet.AltArrowDown
                                  onClick={() => handleDecrement('mortalityNumber')}
                                  className="cursor-pointer hover:text-primary-500"
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
              </FlexBox>
            </Card>
          )}
          <div className=" flex justify-between bg-neutral-100 p-5">
            <Button type="button" variant={'outline'} onClick={handlePrevious}>
              Back
            </Button>
            {recordFishDisease && (
              <Button disabled={createFishDisease.isLoading || !combineDateTime} type="submit">
                Continue
              </Button>
            )}
            {!recordFishDisease && (
              <Button type="button" onClick={() => handleEmptyState()}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
