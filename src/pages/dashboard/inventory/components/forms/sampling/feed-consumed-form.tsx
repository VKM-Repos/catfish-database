import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { samplingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import type { z } from 'zod'
import { useRef } from 'react'

type SamplingFormValues = z.infer<typeof samplingSchema>

export default function FeedConsumedForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-[50%] w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Total feed consumed (kg)
            {/* <span className="font-bold text-red-500">*</span> */}
            <SolarIconSet.QuestionCircle size={16} />
            {/* <Text className="font-light text-neutral-500">(Optional)</Text> */}
          </Text>
          <FormField
            control={form.control}
            name="totalWeightGain"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Current feed consumed"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      field.onChange(value)
                    }}
                  />
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
