import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { sortingSchema } from 'src/schemas'

import type { z } from 'zod'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'

type SortingFormValues = z.infer<typeof sortingSchema>

export default function TransferForm({ form }: { form: UseFormReturn<SortingFormValues> }) {
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full ">
      <div className="p-5">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Transfer</h5>
        <p className="text-xs font-medium">
          Log any fish you’re relocating to other pond(s). For each transfer, specify how many fish and the destination
          pond.
        </p>
      </div>
      <div className="w-full  rounded-lg border border-neutral-200 p-5 px-5">
        <div className="flex w-full items-center gap-5  ">
          <div className="flex w-full flex-col gap-2">
            <Text className="text-sm font-medium text-neutral-500">No of fish Moved for transfer </Text>
            <FormField
              control={form.control}
              name="numberOfFishMovedByTransfer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Input number of fish moved" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Text className="text-sm font-medium text-neutral-500">Destination Pond</Text>
            <FormField
              control={form.control}
              name="destinationPond"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Select Pond" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button variant={'outline'} className="mt-10 gap-3 font-medium">
          <SolarIconSet.AddCircle /> Add another Transfer
        </Button>
      </div>
    </FlexBox>
  )
}
