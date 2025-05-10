import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { samplingSchema } from 'src/schemas'

import type { z } from 'zod'
import { useRef } from 'react'

type SamplingFormValues = z.infer<typeof samplingSchema>

export default function SamplingWeightForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Number of Fish Sampled</Text>
          <FormField
            control={form.control}
            name="numberOfFishSampled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Input total number of fish used for sample data" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Weight of Fish Sampled</Text>
          <FormField
            control={form.control}
            name="weightOfFishSampled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Input number of Deaths recorded" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Avg. Weight of Fish Sampled</Text>
          <FormField
            control={form.control}
            name="avgWeightFishSampled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Input  avg. Weigh of sample" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Total Weight gain</Text>
          <FormField
            control={form.control}
            name="totalWeightGain"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Current Weight Gain" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FlexBox>
  )
}
