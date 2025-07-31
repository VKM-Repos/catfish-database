import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'
import type { dailyFeedingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import type { z } from 'zod'
import { useRef } from 'react'

type PondFormValues = z.infer<typeof dailyFeedingSchema>

export default function SamplingDetailForm({
  form,
  handlePrevious,
}: {
  form: UseFormReturn<PondFormValues>
  handlePrevious: () => void
}) {
  const timeInputRef = useRef<HTMLInputElement>(null)
  const feeds = [
    'Skretting',
    'Coppens',
    'TopFeeds',
    'Blue Crown',
    'Vital Feeds',
    'Aller Aqua',
    'hybrid catfishfeed',
    'Aqualis',
    'Ecofloat',
  ]
  const isWaterSourcesLoading = false

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
    console.log('Helloo')
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Feed Type</Text>
          <FormField
            control={form.control}
            name="feedType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="font-light">
                      <div className="flex items-center justify-center gap-2">
                        <SelectValue placeholder="Select Feed type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {isWaterSourcesLoading ? (
                        <SelectItem value="loading" disabled>
                          <Text>Loading feeds...</Text>
                        </SelectItem>
                      ) : (
                        feeds?.map((feed, index) => (
                          <SelectItem key={index} value={feed}>
                            {feed}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Pellet Size</Text>
          <FormField
            control={form.control}
            name="pelletSize"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="input pellet size" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Feed Quantity</Text>
          <FormField
            control={form.control}
            name="feedQuantity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="input quantity in kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-[60%] flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-500">Feeding Time</Text>
        <FormField
          control={form.control}
          name="feedQuantity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex w-full items-center">
                  {/* <Input type="time" className="" placeholder="Select Time" {...field} /> */}
                  <Input placeholder="Select Time" {...field} />
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <div
                    onClick={handleIconClick}
                    className="z-10 -ml-1 flex h-10 items-center justify-center bg-primary-500 px-3"
                  >
                    <SolarIconSet.ClockCircle color="white" size={20} />
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
