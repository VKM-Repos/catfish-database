import { FlexBox } from 'src/components/ui/flexbox'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Input } from 'src/components/ui/input'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { feedTypeResponseSchema, feedTypeSchema } from 'src/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { scrollToTop } from 'src/lib/utils'
import { Grid } from 'src/components/ui/grid'
import CancelPrompt from '../../ponds/create/prompts/cancel-prompt'
import { Loader } from 'src/components/ui/loader'
import { Button } from 'src/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import PromptNewFeedType from '../prompts/prompt-new-feed'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'

type FeedingTypeData = z.infer<typeof feedTypeSchema>

export default function RegisterFeedTypes() {
  const [error, setError] = useState<ClientErrorType | null>()
  const [open, setOpen] = useState(false)
  const [openCancelPrompt, setOpenCancelPrompt] = useState(false)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const pelletsSize = ['0.5mm', '1.0mm', '2.0mm', '3.0mm', '4.0mm', '5.0mm', '6.0mm', '7.0mm', '8.0mm']

  const useGetFishBatches = createGetQueryHook({
    endpoint: '/fish-batches',
    responseSchema: z.any(),
    queryKey: ['fish-batches'],
  })

  const useCreateFeedTypeMutation = createPostMutationHook({
    endpoint: '/feed-inventories',
    requestSchema: feedTypeSchema,
    responseSchema: feedTypeResponseSchema,
  })

  const { data: fishBatches } = useGetFishBatches()
  const createFeedTypeMutation = useCreateFeedTypeMutation()

  const form = useForm<FeedingTypeData>({
    resolver: zodResolver(feedTypeSchema),
    defaultValues: {
      type: '',
      sizeInMm: '',
      quantityInKg: '',
      totalCost: '',
      costPerKg: '',
    },
    mode: 'onChange',
  })

  const quantityInKg = form.watch('quantityInKg')
  const totalCost = form.watch('totalCost')

  const cost = String(Number(totalCost) / Number(quantityInKg))

  const isValidCost = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value)

  useEffect(() => {
    if (isValidCost(cost)) {
      form.setValue('costPerKg', cost)
    }
  }, [form.setValue, cost])

  const onSubmit = async (values: z.infer<typeof feedTypeSchema>) => {
    try {
      setError(null)
      console.log(values)
    } catch (err) {
      console.error('Error adding feed type:', err)
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

  const handleCancelYes = () => {
    setOpenCancelPrompt(false)
  }

  const handleCancelNo = () => {
    setOpenCancelPrompt(false)
  }

  const handleYesConditionOnClose = () => {
    form.reset()
    setOpen(false)
  }

  const handleNoConditionOnClose = () => {
    form.reset()
    setOpen(false)
    navigate(fishBatches.totalElements > 1 ? paths.dashboard.home.overview : paths.dashboard.home.getStarted)
  }

  return (
    <FlexBox
      direction="col"
      gap="gap-5"
      align="center"
      className="mx-auto w-full max-w-[50%] rounded-lg border border-neutral-200 px-6 py-3"
    >
      <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
        <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
          Register your feed types{' '}
          <span>
            <SolarIconSet.MoneyBag />
          </span>
        </h1>
        <Text>Add each feed’s name, pellet size, and cost to populate your daily feeding options</Text>
      </FlexBox>
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10 rounded-lg py-3">
            {error && <FormValidationErrorAlert error={error} />}
            <div className="flex w-full flex-col items-start gap-1">
              <h5 className="text-[1.5rem] font-bold text-[#444955]">Feed Details</h5>
              <hr className="w-full border border-primary-200" />
            </div>
            <Grid cols={3} gap="gap-2" className="!grid-cols-1 md:!grid-cols-3">
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Feed Type
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="w-full">
                          <Input placeholder="Enter the brand of feed" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="col" gap="gap-2" className="w-full">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Pellet size
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="sizeInMm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select value={field.value || ''} onValueChange={(v) => field.onChange(v)}>
                          <SelectTrigger className="w-full font-light">
                            <div className="flex items-center justify-center gap-2">
                              <SolarIconSet.Weigher />
                              <SelectValue placeholder="Select Pellet size" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {pelletsSize?.map((pellet) => (
                              <SelectItem key={pellet} value={pellet}>
                                {pellet}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="col" gap="gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Feed Quantity
                  <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name="quantityInKg"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="w-full">
                          <Input placeholder="Input quantity in kg" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </Grid>

            <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  {' '}
                  Total cost (₦)
                  <span className="font-bold text-red-500">*</span>
                </Text>
                <FormField
                  control={form.control}
                  name="totalCost"
                  render={({ field }) => (
                    <FormItem className="w-full !space-y-0">
                      <FormControl>
                        <div className="w-full">
                          <Input placeholder="Input cost of feed" {...field} />
                        </div>
                      </FormControl>
                      <div className={`relative min-h-fit`}>
                        <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Cost per kg (₦)
                  <span className="font-bold text-red-500">*</span>
                </Text>
                <FormField
                  control={form.control}
                  name="costPerKg"
                  render={({ field }) => (
                    <FormItem className="w-full !space-y-0">
                      <FormControl>
                        <div className="w-full">
                          <Input placeholder="0" {...field} className="bg-neutral-200 !text-black" disabled />
                        </div>
                      </FormControl>
                      <div className={`relative min-h-fit`}>
                        <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </FlexBox>

            <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 font-medium text-primary-500"
                onClick={() => {
                  setOpenCancelPrompt(true)
                }}
              >
                <Text>Back</Text>
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex items-center gap-2"
                disabled={!form.formState.isValid}
              >
                {createFeedTypeMutation.isLoading ? (
                  <>
                    <Loader type="spinner" size={18} />
                    <Text color="text-inherit" variant="body">
                      Updating
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="text-inherit" variant="body">
                      Continue
                    </Text>
                  </>
                )}
              </Button>
            </FlexBox>
          </form>
        </Form>
        <CancelPrompt
          openCancelPrompt={openCancelPrompt}
          setOpenCancelPrompt={setOpenCancelPrompt}
          handleCancelYes={handleCancelYes}
          handleCancelNo={handleCancelNo}
        />
        <PromptNewFeedType
          open={open}
          setOpen={setOpen}
          handleNoConditionOnClose={handleNoConditionOnClose}
          handleYesConditionOnClose={handleYesConditionOnClose}
        />
      </>
    </FlexBox>
  )
}
