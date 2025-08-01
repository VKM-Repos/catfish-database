import { useState } from 'react'
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
import { cn, scrollToTop } from 'src/lib/utils'
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
    }),
    responseSchema: z.any(),
  })

  const createHarvestMutation = useCreateHarvestMutation()
  const updateSalesRecordMutation = useUpdateSalesRecordMutation()

  const onSubmit = async (values: SalesRecordsFormData) => {
    try {
      setError(null)

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
  const [openCommand, setOpenCommand] = useState(false)
  const [value, setValue] = useState('')
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col gap-10">
          <Grid cols={2} gap="gap-4" className="!grid-cols-1 md:!grid-cols-2">
            <FlexBox direction="col" gap="gap-2" className="col-span-2 w-full">
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
                      <Input placeholder="Total cost (₦)" {...field} value={field.value ?? ''} />
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
                      {/* <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={form.formState.errors.pondId ? 'border-red-500 ring-2 ring-red-500' : ''}
                        >
                          <div className="flex w-full items-center justify-start gap-3 text-neutral-300">
                            <SolarIconSet.Water size={24} />
                            <SelectValue placeholder="Select a pond" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingPonds ? (
                            <SelectItem value="loading" disabled>
                              <Text>Loading ponds...</Text>
                            </SelectItem>
                          ) : (
                            ponds.content?.map((pond: any) => (
                              <SelectItem key={pond.id} value={pond.id}>
                                {pond.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select> */}
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
                        <PopoverContent className="w-[600px]">
                          <Command>
                            <CommandInput placeholder="Search pond..." className="h-9" />
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
            disabled={!form.formState.isValid || createHarvestMutation.isLoading || updateSalesRecordMutation.isLoading}
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
