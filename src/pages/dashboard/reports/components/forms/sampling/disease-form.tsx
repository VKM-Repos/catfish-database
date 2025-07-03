import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { fishDiseaseSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import type { z } from 'zod'
import { useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'

type SamplingFormValues = z.infer<typeof fishDiseaseSchema>

export default function DiseaseForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  const diseases = [
    'BACTERIAL',
    'No Signs of Disease',
    'Fin Rot',
    'Columnaris (Cottonmouth Disease)',
    'Ich (Ichthyophthirius multifiliis) / White Spot',
    'Yellow or Red Ulcer Disease',
    'Gill Flukes (Monogenean Parasites)',
    'Mouth Rot',
    'Tail Rot',
    'Fungal Infection Swim Bladder Disorder',
    'Dropsy (Bloating/Ascites)',
    'External Parasites',
  ]
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-center gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Disease
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="disease"
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
                        <SelectValue placeholder="Select Disease found" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {diseases?.map((disease) => (
                        <SelectItem
                          className="border border-l-0 border-r-0 border-t-0 border-neutral-200"
                          key={disease}
                          value={disease}
                        >
                          {disease}
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
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Disease observations
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 px-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <span>
                      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.11965 1.43408H10.8803C12.4118 1.43407 13.6248 1.43406 14.5742 1.56169C15.5512 1.69305 16.342 1.96982 16.9656 2.59345C17.5893 3.21709 17.866 4.00788 17.9974 4.9849C18.125 5.93424 18.125 7.14727 18.125 8.67874V12.1061C18.125 13.6376 18.125 14.8506 17.9974 15.7999C17.866 16.777 17.5893 17.5677 16.9656 18.1914C16.342 18.815 15.5512 19.0918 14.5742 19.2231C13.6248 19.3508 12.4118 19.3508 10.8803 19.3507H9.11966C7.58819 19.3508 6.37516 19.3508 5.42581 19.2231C4.4488 19.0918 3.65801 18.815 3.03437 18.1914C2.41073 17.5677 2.13397 16.777 2.00261 15.7999C1.87498 14.8506 1.87499 13.6376 1.875 12.1061V8.67873C1.87499 7.14727 1.87498 5.93424 2.00261 4.9849C2.13397 4.00788 2.41073 3.21709 3.03437 2.59345C3.65801 1.96982 4.4488 1.69305 5.42581 1.56169C6.37516 1.43406 7.58819 1.43407 9.11965 1.43408ZM5.59237 2.80055C4.75397 2.91327 4.27093 3.12466 3.91825 3.47733C3.56558 3.83001 3.35419 4.31305 3.24147 5.15146C3.12633 6.00784 3.125 7.13673 3.125 8.72575V12.0591C3.125 13.6481 3.12633 14.777 3.24147 15.6334C3.35419 16.4718 3.56558 16.9548 3.91825 17.3075C4.27093 17.6602 4.75397 17.8716 5.59237 17.9843C6.44876 18.0994 7.57765 18.1007 9.16667 18.1007H10.8333C12.4224 18.1007 13.5512 18.0994 14.4076 17.9843C15.246 17.8716 15.7291 17.6602 16.0817 17.3075C16.4344 16.9548 16.6458 16.4718 16.7585 15.6334C16.8737 14.777 16.875 13.6481 16.875 12.0591V8.72575C16.875 7.13673 16.8737 6.00784 16.7585 5.15146C16.6458 4.31305 16.4344 3.83001 16.0817 3.47733C15.7291 3.12466 15.246 2.91327 14.4076 2.80055C13.5512 2.68541 12.4224 2.68408 10.8333 2.68408H9.16667C7.57765 2.68408 6.44876 2.68541 5.59237 2.80055ZM6.04167 7.05908C6.04167 6.7139 6.32149 6.43408 6.66667 6.43408H13.3333C13.6785 6.43408 13.9583 6.7139 13.9583 7.05908C13.9583 7.40426 13.6785 7.68408 13.3333 7.68408H6.66667C6.32149 7.68408 6.04167 7.40426 6.04167 7.05908ZM6.04167 10.3924C6.04167 10.0472 6.32149 9.76742 6.66667 9.76742H13.3333C13.6785 9.76742 13.9583 10.0472 13.9583 10.3924C13.9583 10.7376 13.6785 11.0174 13.3333 11.0174H6.66667C6.32149 11.0174 6.04167 10.7376 6.04167 10.3924ZM6.04167 13.7257C6.04167 13.3806 6.32149 13.1007 6.66667 13.1007H10.8333C11.1785 13.1007 11.4583 13.3806 11.4583 13.7257C11.4583 14.0709 11.1785 14.3507 10.8333 14.3507H6.66667C6.32149 14.3507 6.04167 14.0709 6.04167 13.7257Z"
                          fill="#444955"
                        />
                      </svg>
                    </span>
                    <Input
                      placeholder="Other disease Observation"
                      {...field}
                      className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
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
