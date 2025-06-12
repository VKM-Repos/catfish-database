import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'
import { dailyFeedingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import type { z } from 'zod'
import { useRef, useState } from 'react'

// Create the schema type
type FishFeedingFormValues = z.infer<typeof dailyFeedingSchema>
interface FishFeedingFormProps {
  form: UseFormReturn<FishFeedingFormValues>
  isWaterRequired?: boolean
}
export default function FishFeedingForm({ form, isWaterRequired = false }: FishFeedingFormProps) {
  const timeInputRef = useRef<HTMLInputElement>(null)
  const feeds = [
    'Pellets',
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
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }

  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full space-y-3 rounded-md">
      <div className="flex w-full items-start gap-5">
        {/* Feed Type Field */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Feed Type <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="feedType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className="font-light">
                      <div className="flex items-center justify-center gap-2">
                        <div>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.11965 1.04163H10.8803C12.4118 1.04161 13.6248 1.0416 14.5742 1.16924C15.5512 1.3006 16.342 1.57736 16.9656 2.201C17.5893 2.82463 17.866 3.61542 17.9974 4.59244C18.125 5.54179 18.125 6.75482 18.125 8.28628V11.7136C18.125 13.2451 18.125 14.4581 17.9974 15.4075C17.866 16.3845 17.5893 17.1753 16.9656 17.7989C16.342 18.4226 15.5512 18.6993 14.5742 18.8307C13.6248 18.9583 12.4118 18.9583 10.8803 18.9583H9.11966C7.58819 18.9583 6.37516 18.9583 5.42581 18.8307C4.4488 18.6993 3.65801 18.4226 3.03437 17.7989C2.41073 17.1753 2.13397 16.3845 2.00261 15.4075C1.87498 14.4581 1.87499 13.2451 1.875 11.7136V8.28628C1.87499 6.75481 1.87498 5.54179 2.00261 4.59244C2.13397 3.61542 2.41073 2.82463 3.03437 2.201C3.65801 1.57736 4.4488 1.3006 5.42581 1.16924C6.37516 1.0416 7.58819 1.04161 9.11965 1.04163ZM5.59237 2.40809C4.75397 2.52081 4.27093 2.7322 3.91825 3.08488C3.56558 3.43755 3.35419 3.92059 3.24147 4.759C3.12633 5.61539 3.125 6.74428 3.125 8.33329V11.6666C3.125 13.2556 3.12633 14.3845 3.24147 15.2409C3.35419 16.0793 3.56558 16.5624 3.91825 16.915C4.27093 17.2677 4.75397 17.4791 5.59237 17.5918C6.44876 17.707 7.57765 17.7083 9.16667 17.7083H10.8333C12.4224 17.7083 13.5512 17.707 14.4076 17.5918C15.246 17.4791 15.7291 17.2677 16.0817 16.915C16.4344 16.5624 16.6458 16.0793 16.7585 15.2409C16.8737 14.3845 16.875 13.2556 16.875 11.6666V8.33329C16.875 6.74428 16.8737 5.61539 16.7585 4.759C16.6458 3.92059 16.4344 3.43755 16.0817 3.08488C15.7291 2.7322 15.246 2.52081 14.4076 2.40809C13.5512 2.29295 12.4224 2.29163 10.8333 2.29163H9.16667C7.57765 2.29163 6.44876 2.29295 5.59237 2.40809ZM6.04167 6.66663C6.04167 6.32145 6.32149 6.04163 6.66667 6.04163H13.3333C13.6785 6.04163 13.9583 6.32145 13.9583 6.66663C13.9583 7.0118 13.6785 7.29163 13.3333 7.29163H6.66667C6.32149 7.29163 6.04167 7.0118 6.04167 6.66663ZM6.04167 9.99996C6.04167 9.65478 6.32149 9.37496 6.66667 9.37496H13.3333C13.6785 9.37496 13.9583 9.65478 13.9583 9.99996C13.9583 10.3451 13.6785 10.625 13.3333 10.625H6.66667C6.32149 10.625 6.04167 10.3451 6.04167 9.99996ZM6.04167 13.3333C6.04167 12.9881 6.32149 12.7083 6.66667 12.7083H10.8333C11.1785 12.7083 11.4583 12.9881 11.4583 13.3333C11.4583 13.6785 11.1785 13.9583 10.8333 13.9583H6.66667C6.32149 13.9583 6.04167 13.6785 6.04167 13.3333Z"
                              fill="#444955"
                            />
                          </svg>
                        </div>
                        <SelectValue placeholder="Select Feed type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {feeds.map((feed) => (
                        <SelectItem
                          className="border border-l-0 border-r-0 border-t-0 border-neutral-200"
                          key={feed}
                          value={feed}
                        >
                          {feed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pellet Size Field */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Pellet Size <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="pelletSize"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className="font-light">
                      <div className="flex items-center justify-center gap-2">
                        <SolarIconSet.Weigher />
                        <SelectValue placeholder="Select Pellet size" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {pelletsSize.map((pellet) => (
                        <SelectItem key={pellet} value={pellet}>
                          {pellet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Feed Quantity Field */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Feed Quantity <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="feedQuantity"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border px-3 ${
                      activeInputs.feedQuantity ? 'bg-neutral-100' : ''
                    } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 ${
                      fieldState.error ? ' border-red-500' : ''
                    }`}
                  >
                    <SolarIconSet.Weigher />
                    <Input
                      placeholder="input quantity in kg"
                      {...field}
                      className="w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length > 1 && value.startsWith('0')) {
                          value = value.replace(/^0+/, '')
                        }
                        field.onChange(value)
                        handleInputChange('feedQuantity', value)
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Feeding Time Field */}
      <div className="flex w-[32%] flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Enter the Feeding Time <span className="font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
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
                        field.onChange(e.target.value)
                        handleInputChange('feedTime', e.target.value)
                      }}
                      ref={timeInputRef}
                      className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                  <div
                    className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                      activeInputs.feedTime ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'
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

      {/* Water Quality Fields (conditionally rendered) */}
      {isWaterRequired && (
        <div className="mt-4 w-full space-y-4">
          <Text className="text-md font-semibold text-neutral-700">Water Quality Parameters</Text>
          <div className="grid grid-cols-3 gap-4">
            {/* Dissolved Oxygen */}
            <FormField
              control={form.control}
              name="dissolvedOxygen"
              render={({ field }) => (
                <FormItem>
                  <Text className="text-sm font-medium text-neutral-700">Dissolved Oxygen (mg/L)</Text>
                  <FormControl>
                    <Input {...field} placeholder="Enter value" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* pH Level */}
            <FormField
              control={form.control}
              name="phLevel"
              render={({ field }) => (
                <FormItem>
                  <Text className="text-sm font-medium text-neutral-700">pH Level</Text>
                  <FormControl>
                    <Input {...field} placeholder="Enter value" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Temperature */}
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <Text className="text-sm font-medium text-neutral-700">Temperature (°C)</Text>
                  <FormControl>
                    <Input {...field} placeholder="Enter value" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add other water quality fields similarly */}
            {/* Ammonia, Nitrite, Nitrate, etc. */}
          </div>
        </div>
      )}
    </FlexBox>
  )
}
