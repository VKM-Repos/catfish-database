import { useState } from 'react'
import { FlexBox } from 'src/components/ui/flexbox'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem } from 'src/components/ui/form'
import { dailyFeedingSchema, dailyWaterQualitySchema } from 'src/schemas'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from 'src/routes'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { Switch } from 'src/components/ui/switch'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { ClientErrorType, ServerErrorType } from 'src/types'
import { scrollToTop } from 'src/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb'
import { Text } from 'src/components/ui/text'
import { CreateReportDialog } from '../../../components/modals/create-report-modal'
import FishFeedingForm from '../../../components/forms/feeding-report/fish-feeding-form'
import WaterQualityForm from '../../../components/forms/feeding-report/water-quality-form'
import { useQueryClient } from '@tanstack/react-query'

type FormData = z.infer<typeof dailyFeedingSchema> & z.infer<typeof dailyWaterQualitySchema>

export default function CreateDailyFeedingReportPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [error, setError] = useState<ClientErrorType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id } = useParams<{ id: string }>()
  const useCreateDailyFeeding = createPostMutationHook({
    endpoint: '/feeding-water-qualities',
    requestSchema: z.any(),
    responseSchema: z.any(),
  })

  const form = useForm<FormData>({
    resolver: zodResolver(dailyFeedingSchema.merge(dailyWaterQualitySchema)),
    defaultValues: {
      feedType: '',
      pelletSize: '',
      feedQuantity: 0,
      feedTime: '',
      dissolvedOxygen: '',
      phLevel: '',
      temperature: '',
      ammonia: '',
      nitrite: '',
      nitrate: '',
      alkalinity: '',
      hardness: '',
      recordWaterQuality: false,
      observation: '',
    },
    mode: 'onChange',
  })

  const { reset } = form
  const createDailyFeeding = useCreateDailyFeeding()

  const onSubmit = async (values: FormData) => {
    setError(null)
    setIsSubmitting(true)
    try {
      const feedingData = {
        pondId: id,
        feedType: values.feedType?.toUpperCase(),
        pelletSize: values.pelletSize ? Number(values.pelletSize.replace('mm', '')) : null,
        quantity: Number(values.feedQuantity),
        // feedTime: values.feedTime,
      }

      const waterQualityData = {
        dissolvedOxygen: values.dissolvedOxygen ? Number(values.dissolvedOxygen) : null,
        phLevel: values.phLevel ? Number(values.phLevel) : null,
        temperature: values.temperature ? Number(values.temperature) : null,
        ammonia: values.ammonia ? Number(values.ammonia) : null,
        nitrite: values.nitrite ? Number(values.nitrite) : null,
        alkalinity: values.alkalinity ? Number(values.alkalinity) : null,
        hardness: values.hardness ? Number(values.hardness) : null,
        frequency: 'DAILY',
        // observation: values.observation ? values.observation : null,
        observation: 'EXCELLENT',
      }

      const formData = { ...feedingData, ...waterQualityData }
      console.log('Submit', formData)
      await createDailyFeeding.mutateAsync(formData)

      queryClient.refetchQueries(['feeding-water-quality'])

      setOpenDialog(true)
    } catch (error) {
      console.error('Submission error:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: ServerErrorType } }
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <FlexBox className="mx-10">
        <CustomBreadcrumb />
      </FlexBox>
      <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto mt-10 w-full max-w-[60%]">
        <>
          <CreateReportDialog open={openDialog} resetForm={reset} onOpenChange={setOpenDialog} />
          {error && <FormValidationErrorAlert error={error} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 pb-0.5">
              {/* Daily Feeding Section */}
              <div className="flex w-full flex-col items-start gap-1">
                <div className="py-5">
                  <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Feeding</h5>
                  <p className="text-xs font-medium">
                    Log today&lsquo;s feed type, amount, and feeding time to track your fish nutrition
                  </p>
                </div>
              </div>
              <div className="w-full rounded-lg border border-neutral-300 p-5">
                <FishFeedingForm form={form} />
              </div>

              <FormField
                control={form.control}
                name="recordWaterQuality"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start justify-between shadow-sm">
                    <div className="space-y-0.5">
                      <FormDescription className="flex items-center gap-1">
                        Do you want to record Water Quality? <span className="text-xl text-error-500">*</span>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span>No</span>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span>Yes</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Water Quality Section */}
              <div className="w-full">
                {form.getValues('recordWaterQuality') && (
                  <div className="">
                    <div className="mb-2 w-full items-start">
                      <div className="py-5">
                        <h5 className="text-[1.5rem] font-bold text-[#444955]">Daily Water Quality</h5>
                        <p className="text-xs font-medium">Record key water parameters to monitor pond health.</p>
                      </div>
                    </div>
                    <div className="w-full rounded-lg border border-neutral-300 p-5">
                      <WaterQualityForm form={form} />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="mb-5 mt-10 flex w-full justify-between bg-neutral-100 px-5 py-3">
                <Button
                  type="button"
                  onClick={() => navigate(paths.dashboard.home.getStarted)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={!form.formState.isValid || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </Button>
              </div>
            </form>
          </Form>
        </>
      </FlexBox>
    </>
  )
}

const CustomBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={paths.dashboard.home.getStarted}>
            <Text className="text-primary-500">Daily Farm Report</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Text>New Entry</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
