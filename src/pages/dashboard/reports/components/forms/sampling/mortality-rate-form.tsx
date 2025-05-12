import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { samplingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'
import type { z } from 'zod'

type SamplingFormValues = z.infer<typeof samplingSchema>

export default function MortalityRateForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const handleIncrement = (fieldName: keyof SamplingFormValues) => {
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    if (!isNaN(currentValue)) {
      const newValue = (currentValue + 1).toString()
      form.setValue(fieldName, newValue, { shouldValidate: true })
    }
  }

  const handleDecrement = (fieldName: keyof SamplingFormValues) => {
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    if (!isNaN(currentValue) && currentValue > 0) {
      const newValue = (currentValue - 1).toString()
      form.setValue(fieldName, newValue, { shouldValidate: true })
    }
  }

  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            No of fish mortality recorded
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="numberOfFishMortalityRecorded"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit w-[50%] items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input number of Deaths recorded"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '') // Only allow numbers
                          field.onChange(value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs">
                      <SolarIconSet.AltArrowUp
                        onClick={() => handleIncrement('numberOfFishMortalityRecorded')}
                        className="cursor-pointer hover:text-primary-500"
                      />
                      <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200" />
                      <SolarIconSet.AltArrowDown
                        onClick={() => handleDecrement('numberOfFishMortalityRecorded')}
                        className="cursor-pointer hover:text-primary-500"
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
    </FlexBox>
  )
}
