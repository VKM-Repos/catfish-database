import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from 'src/components/ui/form'
import { samplingSchema } from 'src/schemas'
import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { useEffect } from 'react'
import SamplingWeightForm from './sampling-weight-from'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from 'src/routes'
import { useFishSamplingStore } from 'src/store/fish-sampling.store'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Alert, AlertDescription } from 'src/components/ui/alert'

type SamplingData = z.infer<typeof samplingSchema>

export default function SamplingIndexForm({ handleNext }: { handleNext: () => void }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')

  const { numberOfFishSampled, weightOfFishSampled, avgWeightFishSampled, totalWeightGain, updateProperty, reset } =
    useFishSamplingStore()
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
    if (from) {
      navigate(paths.dashboard.reports.root + '?tab=sampling-report')
      return
    }
    navigate(paths.dashboard.home.getStarted)
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
                  <div className="mt-[20px] space-y-3 text-[#333740]">
                    <Text className="text-[14px] font-normal">
                      To help you track how well your fish are growing, this section focuses on weight gain during
                      sampling.
                    </Text>
                    <ul className="list-disc pl-10 text-[14px] font-normal">
                      <li>Average Weight Gain </li>
                      <li>Total Weight Gain</li>
                    </ul>
                    <Text className="text-[14px] font-normal">
                      We already know the number of fish you sampled and their starting average weight, so no need to
                      enter those again.
                    </Text>
                  </div>
                </div>
              </div>
            </FlexBox>
            <div className="space-y-5 rounded-md border border-neutral-200 p-5">
              <Alert className="bg-[#E5E7FF] text-[#000AFF]">
                <AlertDescription>
                  <Text> Just enter the Current Average Weight from your recent sample.</Text>
                  <Text>
                    {' '}
                    The system will calculate how much weight they’ve gained since the last check—no need to do any
                    math.
                  </Text>
                </AlertDescription>
              </Alert>
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
