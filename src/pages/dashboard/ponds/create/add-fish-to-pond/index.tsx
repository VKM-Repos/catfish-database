import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { fishDetailsResponseSchema, fishDetailsSchema, paginatedPondResponseSchema } from 'src/schemas'
import { usePondStore } from 'src/store/pond.store'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { useState } from 'react'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Loader } from 'src/components/ui/loader'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'

const useGetFarmerPonds = createGetQueryHook<typeof paginatedPondResponseSchema, { id: string }>({
  endpoint: '/ponds/farmers/me',
  responseSchema: paginatedPondResponseSchema,
  queryKey: ['my-ponds-as-a-farmer'],
})

const useCreateFishBatch = createPostMutationHook({
  endpoint: '/fish-batches',
  requestSchema: fishDetailsSchema,
  responseSchema: fishDetailsResponseSchema,
})

export default function AddFishPond() {
  const { pondData, setPondStore } = usePondStore()
  const { data: ponds, isLoading } = useGetFarmerPonds()
  const navigate = useNavigate()

  const [error, setError] = useState<ClientErrorType | null>(null)

  const pondNames = ponds?.content.map((pond) => pond.name)
  const fishSizes = ['Fingerling', 'Fry', 'Post-fingerling', 'Juvenile', 'Jumbo', 'Table size', 'Broodstock', 'Adult']

  const form = useForm({
    resolver: zodResolver(fishDetailsSchema),
    defaultValues: {
      pondId: '',
      quantity: '',
      supplier: '',
      singleCost: '',
      costOfSupply: '',
      fishDescription: '',
      fishSize: '',
    },
    mode: 'onChange',
  })

  const quantity = form.watch('quantity')
  const singleCost = form.watch('singleCost')

  const total = String(Number(singleCost) * Number(quantity) || 0)

  const isValidCost = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value)

  if (isValidCost(total)) {
    form.setValue('costOfSupply', total)
  }
  const createFishBatch = useCreateFishBatch()

  const onSubmit = async (values: z.infer<typeof fishDetailsSchema>) => {
    const selectedPond = ponds?.content.find((pond: any) => pond.name === values.pondId)

    try {
      setPondStore({
        ...pondData,
        pondId: selectedPond?.id,
        quantity: values.quantity,
        costOfSupply: values.costOfSupply,
        fishDescription: values.fishDescription,
        fishSize: values.fishSize,
      })

      await createFishBatch.mutateAsync({
        ...values,
        pondId: selectedPond?.id as string,
      })
    } catch (err) {
      console.error('Error creating fish batch:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data
        console.log(errorData)
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

  if (isLoading) return <LoadingScreen />

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="w-full">
      {error && <FormValidationErrorAlert error={error} />}
      <div className="mb-2 w-full items-start gap-1">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish Details</h5>
        <hr className="w-full border border-primary-200" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
          <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                Select the pond to which you want to add the field
                <span className="gap-2 font-bold text-red-500">*</span>
                <span className="ml-2">
                  <SolarIconSet.QuestionCircle size={16} />
                </span>
              </Text>
              <FormField
                control={form.control}
                name="pondId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="font-light">
                          <div className="flex items-center justify-center gap-2">
                            <SelectValue placeholder="Select pond" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {pondNames?.map((name: string, index: number) => (
                            <SelectItem key={index} value={name}>
                              {name}
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
            <FlexBox gap="gap-4" align="center" className="w-full flex-col md:flex-row">
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  Quantity of fish supplied
                  <span className="gap-2 font-bold text-red-500">*</span>
                  <span className="ml-2">
                    <SolarIconSet.QuestionCircle size={16} />
                  </span>
                </Text>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Input number of fish added to pond" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  Fish Size
                  <span className="gap-2 font-bold text-red-500">*</span>
                  <span className="ml-2">
                    <SolarIconSet.QuestionCircle size={16} />
                  </span>
                </Text>
                <FormField
                  control={form.control}
                  name="fishSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="font-light">
                            <div className="flex items-center justify-center gap-2">
                              <SelectValue placeholder="Select size of fish" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {fishSizes?.map((fishSize, index) => (
                              <SelectItem key={index} value={fishSize}>
                                {fishSize}
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
            </FlexBox>
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                Fish Description
                <span className="gap-2 font-bold text-red-500">*</span>
                <span className="ml-2">
                  <SolarIconSet.QuestionCircle size={16} />
                </span>
              </Text>
              <FormField
                control={form.control}
                name="fishDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Input description of fish added to pond" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                Supplier
                <span className="gap-2 font-bold text-red-500">*</span>
                <span className="ml-2">
                  <SolarIconSet.QuestionCircle size={16} />
                </span>
              </Text>
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="From whom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                Cost of fish
                <span className="gap-2 font-bold text-red-500">*</span>
                <span className="ml-2">
                  <SolarIconSet.QuestionCircle size={16} />
                </span>
              </Text>
              <FormField
                control={form.control}
                name="singleCost"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                        <div className="h-full bg-primary-500 px-3 py-[.65rem] text-sm text-white">₦</div>
                        <div className="w-full">
                          <Input
                            placeholder="Amount in naira"
                            {...field}
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
            <div className="flex w-full flex-col gap-2">
              <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                Total Cost
                <span className="gap-2 font-bold text-red-500">*</span>
                <span className="ml-2">
                  <SolarIconSet.QuestionCircle size={16} />
                </span>
              </Text>
              <FormField
                control={form.control}
                name="costOfSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                        <div className="h-full bg-primary-500 px-3 py-[.65rem] text-sm text-white">₦</div>
                        <div className="w-full">
                          <Input
                            {...field}
                            placeholder="Amount in naira"
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
          </FlexBox>
          <div className="flex w-full items-center justify-between bg-neutral-50 px-6 py-3">
            <Button
              variant="outline"
              className="rounded-lg bg-white"
              onClick={() => navigate(paths.dashboard.ponds.root)}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              // disabled={!form.formState.isValid}
            >
              {createFishBatch.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text color="text-inherit" variant="body">
                    Updating
                  </Text>
                </>
              ) : (
                <>
                  <Text color="text-inherit" variant="body">
                    Save
                  </Text>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FlexBox>
  )
}
