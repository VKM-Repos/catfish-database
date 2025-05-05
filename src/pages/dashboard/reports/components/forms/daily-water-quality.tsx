import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { dailyFeedingSchema } from 'src/schemas'
import type { z } from 'zod'

type PondFormValues = z.infer<typeof dailyFeedingSchema>

export default function DailyWaterQuality({ form }: { form: UseFormReturn<PondFormValues> }) {
  return (
    <FlexBox gap="gap-2" direction="col" className="w-full">
      <div className="flex items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-300">Dissolved Oxygen</Text>
          <FormField
            control={form.control}
            name="dissolvedOxygen"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="e.g -44.4409092"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">mg/L</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-300">PH Level</Text>
          <FormField
            control={form.control}
            name="phLevel"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="e.g 110.84933"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">1-4 scale)</div>
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
