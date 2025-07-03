import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { samplingSchema } from 'src/schemas'
import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import SamplingWeightForm from './sampling-weight-from'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'
import { useDateStore } from 'src/store/report-date-store'

type SamplingData = z.infer<typeof samplingSchema>

export default function SamplingIndexForm({ handleNext }: { handleNext: () => void }) {
  const navigate = useNavigate()
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})
  const timeInputRef = useRef<HTMLInputElement>(null)

  const { numberOfFishSampled, weightOfFishSampled, avgWeightFishSampled, totalWeightGain, updateProperty, reset } =
    useFishSamplingStore()
  const { selectedDate, setSelectedDate } = useDateStore()
  const form = useForm<SamplingData>({
    resolver: zodResolver(samplingSchema),
    defaultValues: {
      numberOfFishSampled,
      weightOfFishSampled,
      avgWeightFishSampled,
      totalWeightGain,
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
  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }
  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedDate(newDate) // Persist to store
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 pb-0.5">
          <div className="w-full">
            <FlexBox direction="row" justify="between" align="center" className="mb-5 w-full items-start">
              <div className="mb-5 flex w-full flex-col items-start gap-1">
                <div className="p-5">
                  <h5 className="text-[1.5rem] font-bold text-[#444955]">Sample Weight</h5>
                  <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
                </div>
              </div>
              <div
                className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                  activeInputs.feedTime ? 'bg-primary-100' : ''
                } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 `}
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
                    ref={timeInputRef}
                    className={`md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden `}
                  />
                </div>
                <div
                  className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                    activeInputs.date ? 'bg-primary-500 text-white' : 'bg-primary-500 text-white'
                  }`}
                  onClick={handleIconClick}
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
            </FlexBox>
            <div className="rounded-md border border-neutral-200 p-5">
              <SamplingWeightForm form={form} />
            </div>
          </div>

          <div className="mb-5 mt-10 flex w-full justify-between bg-neutral-100 px-5 py-3">
            <Button type="button" onClick={handleCancel} variant="outline" className="flex items-center gap-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex items-center gap-2">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
