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
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from 'src/routes'
import { CreateReportDialog } from '../../modals/create-report-modal'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { LoadingScreen } from 'src/components/global/loading-screen'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { FlexBox } from 'src/components/ui/flexbox'
import { useQueryClient } from '@tanstack/react-query'

type HarvestFormValues = z.infer<typeof harvestSchema>

export function HarvestForm({ handlePrevious }: { handlePrevious: () => void; handleNext: () => void }) {
  const navigate = useNavigate()
  const [error, setError] = useState<ClientErrorType | null>()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const timeInputRef = useRef<HTMLInputElement>(null)
  const useHarvestReport = createPostMutationHook({
    endpoint: `/harvests/${id}`,
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

  const createHarvestReport = useHarvestReport()

  const onSubmit = async (data: z.infer<typeof harvestSchema>) => {
    try {
      const harvestData = {
        quantity: Number(data.numberOfFishHarvested),
        totalWeightHarvested: Number(data.totalWeightHarvested),
        costPerKg: Number(data.costPerKg),
        costPerFish: 10,
      }
      await createHarvestReport.mutateAsync(harvestData)
      await queryClient.refetchQueries(['fish-batches-in-ponds'])
      await queryClient.refetchQueries(['my-ponds-in-ponds'])
      await queryClient.refetchQueries(['stocking-harvest-data'])

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
  if (createHarvestReport.isLoading) {
    return <LoadingScreen />
  }

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  return (
    <>
      <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
      {error && <FormValidationErrorAlert error={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <FlexBox direction="row" justify="between" align="center">
              <div className="p-5">
                <h5 className="text-[1.5rem] font-bold text-[#444955]">Harvest Report</h5>
                <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
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
                    value={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
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

            <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5">
              <div className="flex w-full items-center gap-5">
                <div className="flex w-full flex-col gap-2">
                  <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    Number of Fish Harvested <span className="font-bold text-red-500">*</span>
                    <SolarIconSet.QuestionCircle size={16} />
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
                    <span className="font-bold text-red-500">*</span>
                    <SolarIconSet.QuestionCircle size={16} />
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
