import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { samplingSchema } from 'src/schemas'

import type { z } from 'zod'
import { useRef } from 'react'

type SamplingFormValues = z.infer<typeof samplingSchema>

export default function DiseaseForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Disease</Text>
          <FormField
            control={form.control}
            name="disease"
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
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Disease observations</Text>
          <FormField
            control={form.control}
            name="diseaseObservation"
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
    </FlexBox>
  )
}
