import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { sortingSchema } from 'src/schemas'

import type { z } from 'zod'
import { useRef } from 'react'

type SortingFormValues = z.infer<typeof sortingSchema>

export default function FishHarvestForm({ form }: { form: UseFormReturn<SortingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full ">
      <div className="p-5">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Harvest</h5>
        <p className="text-xs font-medium">
          Record the number of fish you are removing from this batch for harvest today. This will update your remaining
          stock automatically.
        </p>
      </div>
      <div className="flex w-full items-center gap-5 rounded-lg border border-neutral-200 p-5 px-5 ">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">No of fish Moved for Harvest </Text>
          <FormField
            control={form.control}
            name="numberOfFishHarvest"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Input number of Fish Moved" {...field} />
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
