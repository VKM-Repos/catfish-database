import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormField, FormItem, FormControl, FormMessage } from 'src/components/ui/form'
import { Text } from 'src/components/ui/text'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'
import { Input } from 'src/components/ui/input'
import { Grid } from 'src/components/ui/grid'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { cn, formatCurrency, scrollToTop } from 'src/lib/utils'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { ClientErrorType, ServerErrorType } from 'src/types'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'src/components/ui/command'
import { Button } from 'src/components/ui/button'

// Schema for UI validation only
const salesRecordSchema = z.object({
  pondId: z.string().min(1, 'Pond is required'),
  quantity: z.string().min(1, 'Number of fish harvested is required'),
  totalWeightHarvested: z.string().min(1, 'Total weight is required'),
  totalCost: z.string().min(1, 'Total cost is required'), // only for frontend calc
})

type SalesRecordsFormData = z.infer<typeof salesRecordSchema>

type SalesRecordsFormProps = {
  onCancel: () => void
  setStep: (step: number) => void
  mode: 'create' | 'edit'
  initialValues?: any
  onSuccess?: () => void
}

export default function SalesRecordsForm({ onCancel, setStep, mode, initialValues, onSuccess }: SalesRecordsFormProps) {
  const [error, setError] = useState<ClientErrorType | null>()
  const queryClient = useQueryClient()

  const form = useForm<SalesRecordsFormData>({
    resolver: zodResolver(salesRecordSchema),
    defaultValues: {
      pondId: initialValues?.pondId || '',
      quantity: initialValues?.quantity?.toString() || '',
      totalWeightHarvested: initialValues?.totalWeightHarvested?.toString() || '',
      totalCost: initialValues?.totalCost?.toString() || '',
    },
    mode: 'onChange',
  })

  // Fetch ponds
  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me?size=1000000&sortBy=DESC',
    responseSchema: z.any(),
    queryKey: ['my-ponds-in-create-sales'],
  })
  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()
  const pondId = initialValues?.pondId || form.watch('pondId')

  // Update placeholder if needed (not used in harvest POST)
  const useUpdateSalesRecordMutation = createPutMutationHook({
    endpoint: `/sales-records/${initialValues?.id}`,
    requestSchema: salesRecordSchema,
    responseSchema: salesRecordSchema,
  })
  // Create mutation
  const useCreateHarvestMutation = createPostMutationHook({
    endpoint: `/harvests/${pondId}`,
    requestSchema: z.object({
      quantity: z.number(),
      totalWeightHarvested: z.number(),
      costPerKg: z.number(),
      costPerFish: z.number(),
      harvestTime: z.string(),
    }),
    responseSchema: z.any(),
  })

  const createHarvestMutation = useCreateHarvestMutation()
  const updateSalesRecordMutation = useUpdateSalesRecordMutation()

  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0], // Default: today's date
  )
  const timeInputRef = useRef<HTMLInputElement>(null)
  const [openCommand, setOpenCommand] = useState(false)
  const [value, setValue] = useState('')
  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }
  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  const onSubmit = async (values: SalesRecordsFormData) => {
    try {
      setError(null)
      const harvestTime = new Date(`${selectedDate}T${new Date().toTimeString().slice(0, 8)}`).toISOString()
      const quantity = Number(values.quantity)
      const totalWeightHarvested = Number(values.totalWeightHarvested)
      const totalCost = Number(values.totalCost)
      const costPerKg = totalWeightHarvested ? totalCost / totalWeightHarvested : 0
      const costPerFish = quantity ? totalCost / quantity : 0

      if (mode === 'create') {
        await createHarvestMutation.mutateAsync({
          quantity,
          totalWeightHarvested,
          costPerKg,
          costPerFish,
          harvestTime,
        })

        queryClient.refetchQueries(['sales-records'])
        form.reset()
        onSuccess?.()
        setStep(2)
      } else if (mode === 'edit' && initialValues?.id) {
        await updateSalesRecordMutation.mutateAsync(values)
        queryClient.refetchQueries(['sales-records'])
        form.reset()
        onSuccess?.()
        setStep(2)
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
          scrollToTop()
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col gap-10">
          <Grid cols={2} gap="gap-4" className="!flex !grid-cols-1 flex-col md:!grid md:!grid-cols-2">
            <FlexBox direction="col" gap="gap-2" className=" w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Date<span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <div
                className={`focus-within:ring-offset-background flex max-h-fit w-full items-center rounded-md border ${
                  activeInputs.feedTime ? 'bg-primary-100' : ''
                } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 `}
              >
                <div className="w-full">
                  <Input
                    data-placeholder={'Select date'}
                    type="date"
                    value={selectedDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value)
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
            <FlexBox direction="col" gap="gap-2" className=" w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Number of fish harvested <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Number of fish harvested" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Total weight of fish harvested (kg) <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="totalWeightHarvested"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Total weight (kg)" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            <FlexBox direction="col" gap="gap-2" className="w-full">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Total cost (₦) <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Total cost (₦)"
                        value={formatCurrency(field.value) ?? ''}
                        onChange={(e) => {
                          // Remove all non-digit characters
                          const rawValue = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(rawValue)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            <FlexBox direction="col" gap="gap-2" className="col-span-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                Pond Name <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="pondId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Popover open={openCommand} onOpenChange={setOpenCommand}>
                        <PopoverTrigger className="w-full" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCommand}
                            className="w-full justify-between border-neutral-200 py-2 text-neutral-500"
                          >
                            <div className="flex items-center gap-5">
                              {' '}
                              <SolarIconSet.Water color="text-inherit" size={24} iconStyle="Outline" />
                              {value ? ponds.content?.find((pond: any) => pond.name === value)?.name : 'Select Pond'}
                            </div>
                            <ChevronDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[2000] w-[600px]">
                          <Command>
                            <CommandInput placeholder="Search pond..." className="z-[2000] h-9" />
                            <CommandList>
                              <CommandEmpty>No pond found.</CommandEmpty>
                              <CommandGroup>
                                {ponds.content?.map((pond: any) => (
                                  <CommandItem
                                    key={pond.id}
                                    value={pond.name}
                                    onSelect={(currentValue: string) => {
                                      setValue(currentValue === value ? '' : currentValue)
                                      setOpenCommand(false)
                                      field.onChange(pond.id)
                                      form.trigger('pondId')
                                    }}
                                  >
                                    {(pond as { name: string }).name}
                                    <Check
                                      className={cn('ml-auto', value === pond.name ? 'opacity-100' : 'opacity-0')}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </Grid>
        </div>
        <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-white font-medium text-primary-500"
            onClick={onCancel}
          >
            <Text>Back</Text>
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
            disabled={
              !form.formState.isValid ||
              createHarvestMutation.isLoading ||
              updateSalesRecordMutation.isLoading ||
              !selectedDate
            }
          >
            {createHarvestMutation.isLoading || updateSalesRecordMutation.isLoading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text color="text-inherit" variant="body">
                  {mode === 'edit' ? 'Updating' : 'Saving'}
                </Text>
              </>
            ) : (
              <Text color="text-inherit" variant="body">
                Continue
              </Text>
            )}
          </Button>
        </FlexBox>
      </form>
    </Form>
  )
}
