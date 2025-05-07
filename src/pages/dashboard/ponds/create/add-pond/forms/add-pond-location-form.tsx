import { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'

type PondFormValues = z.infer<typeof pondSchema>

export default function AddPondLocationForm({ form }: { form: UseFormReturn<PondFormValues> }) {
  return (
    <FlexBox gap="gap-5" direction="col" className="w-full">
      <div className="flex w-full flex-col gap-2 border-neutral-200">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond cluster
          <span className="font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="e.g cluster" {...field} className="bg-neutral-100 !py-3" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          {' '}
          Gps Longitude
          <span className="font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="flex h-full items-center gap-2 bg-[#651391] px-3 py-[.65rem] text-sm text-white">
                    Longitude
                  </div>
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
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Gps Latitude
          <span className="font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="h-full bg-[#651391] px-3 py-[.65rem] text-sm text-white">Latitude</div>
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
    </FlexBox>
  )
}
