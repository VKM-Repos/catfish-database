import { useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { dailyFeedingSchema } from 'src/schemas'
import type { z } from 'zod'

type DailyWaterQuality = z.infer<typeof dailyFeedingSchema>

export default function DailyWaterQuality({ form }: { form: UseFormReturn<DailyWaterQuality> }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }
  const { watch, setValue } = form
  const waterQualityFile = watch('waterQualityObservation')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('waterQualityObservation', file, { shouldValidate: true })
  }

  // const removeFile = () => {
  //   setValue('waterQualityObservation' , { shouldValidate: true })
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ''
  //   }
  // }

  return (
    <FlexBox gap="gap-2" direction="col" className="w-full px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Dissolved Oxygen</Text>
          <FormField
            control={form.control}
            name="dissolvedOxygen"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input dissolved oxygen"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-primary-500 px-3 py-[.65rem] text-xs text-white">mg/L</div>
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
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full w-[95px] bg-primary-500 px-3 py-[.65rem] text-xs text-white">
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
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Temperature</Text>
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input temperature"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full w-[50px] bg-primary-500 px-3 py-[.65rem] text-xs text-white">
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
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-primary-500 px-3 py-[.65rem] text-xs text-white">mg/L</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Nitrite</Text>
          <FormField
            control={form.control}
            name="nitrite"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-primary-500 px-3 py-[.65rem] text-xs text-white">mg/L</div>
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
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full bg-primary-500 px-3 py-[.65rem] text-xs text-white">mg/L</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="text-sm font-medium text-neutral-500">Alkalinity</Text>
          <FormField
            control={form.control}
            name="alkalinity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full w-[130px] bg-primary-500 px-3 py-[.65rem] text-xs text-white">
                      {' '}
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
                  <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    <div className="w-full">
                      <Input
                        placeholder="Input value"
                        {...field}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="h-full w-[130px] bg-primary-500 px-3 py-[.65rem] text-xs text-white">
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
      <Text className="text-sm font-medium text-neutral-500">Water Quality Observations</Text>
      <FormField
        control={form.control}
        name="waterQualityObservation"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="file"
                placeholder="input value"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                ref={fileInputRef}
                className="absolute opacity-0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <button
        type="button"
        onClick={handleSelectFile}
        className="flex w-full items-start rounded-md border border-neutral-200 px-5"
      >
        <div className="flex gap-3 py-8">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.11965 1.04175H10.8803C12.4118 1.04174 13.6248 1.04172 14.5742 1.16936C15.5512 1.30072 16.342 1.57748 16.9656 2.20112C17.5893 2.82475 17.866 3.61554 17.9974 4.59256C18.125 5.54191 18.125 6.75494 18.125 8.28641V11.7138C18.125 13.2452 18.125 14.4583 17.9974 15.4076C17.866 16.3846 17.5893 17.1754 16.9656 17.799C16.342 18.4227 15.5512 18.6994 14.5742 18.8308C13.6248 18.9584 12.4118 18.9584 10.8803 18.9584H9.11966C7.58819 18.9584 6.37516 18.9584 5.42581 18.8308C4.4488 18.6994 3.65801 18.4227 3.03437 17.799C2.41073 17.1754 2.13397 16.3846 2.00261 15.4076C1.87498 14.4583 1.87499 13.2452 1.875 11.7138V8.2864C1.87499 6.75493 1.87498 5.54191 2.00261 4.59256C2.13397 3.61554 2.41073 2.82475 3.03437 2.20112C3.65801 1.57748 4.4488 1.30072 5.42581 1.16936C6.37516 1.04172 7.58819 1.04174 9.11965 1.04175ZM5.59237 2.40821C4.75397 2.52094 4.27093 2.73233 3.91825 3.085C3.56558 3.43768 3.35419 3.92071 3.24147 4.75912C3.12633 5.61551 3.125 6.7444 3.125 8.33341V11.6667C3.125 13.2558 3.12633 14.3847 3.24147 15.241C3.35419 16.0794 3.56558 16.5625 3.91825 16.9152C4.27093 17.2678 4.75397 17.4792 5.59237 17.5919C6.44876 17.7071 7.57765 17.7084 9.16667 17.7084H10.8333C12.4224 17.7084 13.5512 17.7071 14.4076 17.5919C15.246 17.4792 15.7291 17.2678 16.0817 16.9152C16.4344 16.5625 16.6458 16.0794 16.7585 15.241C16.8737 14.3847 16.875 13.2558 16.875 11.6667V8.33342C16.875 6.7444 16.8737 5.61551 16.7585 4.75912C16.6458 3.92071 16.4344 3.43768 16.0817 3.085C15.7291 2.73233 15.246 2.52094 14.4076 2.40821C13.5512 2.29308 12.4224 2.29175 10.8333 2.29175H9.16667C7.57765 2.29175 6.44876 2.29308 5.59237 2.40821ZM6.04167 6.66675C6.04167 6.32157 6.32149 6.04175 6.66667 6.04175H13.3333C13.6785 6.04175 13.9583 6.32157 13.9583 6.66675C13.9583 7.01193 13.6785 7.29175 13.3333 7.29175H6.66667C6.32149 7.29175 6.04167 7.01193 6.04167 6.66675ZM6.04167 10.0001C6.04167 9.6549 6.32149 9.37508 6.66667 9.37508H13.3333C13.6785 9.37508 13.9583 9.6549 13.9583 10.0001C13.9583 10.3453 13.6785 10.6251 13.3333 10.6251H6.66667C6.32149 10.6251 6.04167 10.3453 6.04167 10.0001ZM6.04167 13.3334C6.04167 12.9882 6.32149 12.7084 6.66667 12.7084H10.8333C11.1785 12.7084 11.4583 12.9882 11.4583 13.3334C11.4583 13.6786 11.1785 13.9584 10.8333 13.9584H6.66667C6.32149 13.9584 6.04167 13.6786 6.04167 13.3334Z"
              fill="#444955"
            />
          </svg>

          <text className="text-sm text-neutral-300">
            {waterQualityFile?.name ? waterQualityFile?.name : 'What are your observation about the water today'}
          </text>
        </div>
      </button>
    </FlexBox>
  )
}
