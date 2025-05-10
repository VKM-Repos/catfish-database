import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { Textarea } from 'src/components/ui/textarea'
import type { dailyFeedingSchema } from 'src/schemas'
import type { z } from 'zod'

type DailyWaterQuality = z.infer<typeof dailyFeedingSchema>

export default function DailyWaterQuality({ form }: { form: UseFormReturn<DailyWaterQuality> }) {
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }

  return (
    <FlexBox gap="gap-2" direction="col" className="w-full space-y-3 px-5">
      <div className="flex h-full w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Dissolved Oxygen</Text>
          <FormField
            control={form.control}
            name="dissolvedOxygen"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.dissolvedOxygen ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input dissolved oxygen"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('dissolvedOxygen', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 px-3 py-[.65rem] text-xs ${
                        activeInputs.dissolvedOxygen ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">PH Level</Text>
          <FormField
            control={form.control}
            name="phLevel"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.phLevel ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('phLevel', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 w-[95px] px-3 py-[.65rem] text-xs ${
                        activeInputs.phLevel ? 'bg-primary-500  text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      1{'-'}14 scale)
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Temperature</Text>
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.temperature ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input temperature"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('temperature', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 w-[50px] px-3 py-[.65rem] text-xs ${
                        activeInputs.temperature ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      <sup className="text-[8px]">0</sup> C
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Ammonia</Text>
          <FormField
            control={form.control}
            name="ammonia"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.ammonia ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('ammonia', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 px-3 py-[.65rem] text-xs ${
                        activeInputs.ammonia ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Nitrite</Text>
          <FormField
            control={form.control}
            name="nitrite"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.nitrite ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('nitrite', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 px-3 py-[.65rem] text-xs ${
                        activeInputs.nitrite ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Nitrate</Text>
          <FormField
            control={form.control}
            name="nitrate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.nitrate ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('nitrate', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 px-3 py-[.65rem] text-xs ${
                        activeInputs.nitrate ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Alkalinity</Text>
          <FormField
            control={form.control}
            name="alkalinity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.alkalinity ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('alkalinity', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 w-[130px] px-3 py-[.65rem] text-xs ${
                        activeInputs.alkalinity ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L CaCO <sub>3</sub>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Hardness</Text>
          <FormField
            control={form.control}
            name="hardness"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                      activeInputs.hardness ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('hardness', e.target.value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={`h-10 w-[130px] px-3 py-[.65rem] text-xs ${
                        activeInputs.hardness ? 'bg-primary-500 text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      mg/L CaCO <sub>3</sub>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-500">Water Quality Observations</Text>
        <FormField
          control={form.control}
          name="waterQualityObservation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                    activeInputs.hardness ? 'bg-neutral-100' : ''
                  } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                >
                  <div className="w-full">
                    <Textarea {...field} placeholder="What are your observation about the water today" />
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
