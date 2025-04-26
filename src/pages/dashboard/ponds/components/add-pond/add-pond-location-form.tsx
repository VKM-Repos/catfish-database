import { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'

type PondFormValues = z.infer<typeof pondSchema>

export default function AddPondLocationForm({ form }: { form: UseFormReturn<PondFormValues> }) {
  return (
    <FlexBox gap="gap-2" direction="col" className="w-full">
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Longitude</Text>
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">Longitude</div>
                  <div className="w-full">
                    <Input
                      placeholder="e.g -44.4409092"
                      {...field}
                      className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Latitude</Text>
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">Latitude</div>
                  <div className="w-full">
                    <Input
                      placeholder="e.g 110.84933"
                      {...field}
                      className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Pond cluster</Text>
        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="e.g cluster" {...field} className="!py-3" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FlexBox>
  )
}
