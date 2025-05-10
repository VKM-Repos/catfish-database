import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'
import type { dailyFeedingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import type { z } from 'zod'
import { useRef, useState } from 'react'

type PondFormValues = z.infer<typeof dailyFeedingSchema>

export default function DailyFeedingDetailsForm({ form }: { form: UseFormReturn<PondFormValues> }) {
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
  const pelletsSize = ['0.5mm', '1.0mm', '2.0mm', '3.0mm', '4.0mm', '5.0mm', '6.0mm', '7.0mm', '8.0mm']
  const isWaterSourcesLoading = false
  const isPondTypesLoading = false
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
    console.log('Helloo')
  }
  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full space-y-3 rounded-md px-5">
      <div className="flex w-full items-start gap-5">
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
                        feeds?.map((feed) => (
                          <SelectItem key={feed} value={feed}>
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
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="font-light">
                      <div className="flex items-center justify-center gap-2">
                        <SelectValue placeholder="Select Pellet Size" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {isWaterSourcesLoading ? (
                        <SelectItem value="loading" disabled>
                          <Text>Loading pellet...</Text>
                        </SelectItem>
                      ) : (
                        pelletsSize?.map((pellet) => (
                          <SelectItem key={pellet} value={pellet}>
                            {pellet}
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
      <div className="flex w-[32%] flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-500">Feeding Time</Text>
        <FormField
          control={form.control}
          name="feedTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                    activeInputs.feedTime ? 'bg-primary-100' : ''
                  } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                >
                  <div className="w-full">
                    <Input
                      data-placeholder={'Select Time'}
                      type="time"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleInputChange('feedTime', e.target.value)
                      }}
                      ref={timeInputRef}
                      className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0
                 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <div
                    className={`h-10 cursor-pointer px-3 py-[.65rem] text-xs ${
                      activeInputs.feedTime ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                    }`}
                    onClick={handleIconClick}
                  >
                    <SolarIconSet.ClockCircle />
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
