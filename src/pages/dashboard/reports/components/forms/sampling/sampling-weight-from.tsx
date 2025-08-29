import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { samplingSchema } from 'src/schemas'
import * as SolarIconSet from 'solar-icon-set'

import { z } from 'zod'
import { useEffect, useState } from 'react'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { useParams } from 'react-router-dom'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'

type SamplingFormValues = z.infer<typeof samplingSchema>

export default function SamplingWeightForm({ form }: { form: UseFormReturn<SamplingFormValues> }) {
  const { watch, setValue } = form
  const { id } = useParams<{ id: string }>()
  const [weightOfFishScale, setWeightOfFishScale] = useState('kg')
  const [currentAverageScale, setCurrentAverageScale] = useState('kg')
  const [initialWeightScale, setInitialWeightScale] = useState('kg')
  const [averageWeightGaincale, setAverageWeightGaincale] = useState('kg')
  const [totalWeightGainScale, settotalWeightGainScale] = useState('kg')
  const weightOfFishSampled = watch('weightOfFishSampled')
  const numberOfFishSampled = watch('numberOfFishSampled')
  const useGetActiveFishBatch = createGetQueryHook({
    endpoint: `/fish-batches/pond/${id}/active`,
    responseSchema: z.any(),
    queryKey: [`fish-batch-for-sampling-${id}`],
  })
  const { data: activeFishBatch } = useGetActiveFishBatch()
  // Calculate derived values
  const weightOfFishSampledInKg = (Number(weightOfFishSampled) || 0) * (weightOfFishScale === 'g' ? 0.001 : 1)
  const currentAvgWeight = weightOfFishSampledInKg / Number(numberOfFishSampled) || 0
  const initialWeightInGrams = activeFishBatch?.[0]?.initialWeight || 0
  const initialWeightInKg = initialWeightInGrams / 1000 // convert g to kg

  const avgWeightGain = currentAvgWeight - initialWeightInKg
  const totalFishInPond = activeFishBatch?.[0]?.latestQuantity || 0
  const totalWeightGain = avgWeightGain * totalFishInPond

  // Update form values whenever calculations change
  useEffect(() => {
    if (Number(numberOfFishSampled) > 0) {
      setValue('avgWeightFishSampled', weightOfFishSampledInKg.toFixed(5))
    }
    setValue('totalWeightGain', totalWeightGain.toFixed(5))
  }, [weightOfFishSampledInKg, totalWeightGain, numberOfFishSampled, setValue])

  const handleIncrement = (fieldName: keyof SamplingFormValues) => {
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (!isNaN(currentValue)) {
      const newValue = (currentValue + 1).toString()
      form.setValue(fieldName, newValue)
    }
  }

  const handleDecrement = (fieldName: keyof SamplingFormValues) => {
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const currentValue = parseFloat(form.getValues(fieldName) || '0')
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (!isNaN(currentValue) && currentValue > 0) {
      const newValue = (currentValue - 1).toString()
      form.setValue(fieldName, newValue)
    }
  }
  // get-fish-by-pond
  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full rounded-md px-5">
      <div className="flex w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Number of Fish Sampled
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
            {/* <Text className="font-light text-neutral-500">(Optional)</Text> */}
          </Text>

          <FormField
            control={form.control}
            name="numberOfFishSampled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={
                      'focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
                    }
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input total number of fish used for sample data"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div
                      className={
                        'flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs'
                      }
                    >
                      <SolarIconSet.AltArrowUp
                        onClick={() => handleIncrement('numberOfFishSampled')}
                        className="cursor-pointer"
                      />
                      <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200 " />
                      <SolarIconSet.AltArrowDown
                        onClick={() => handleDecrement('numberOfFishSampled')}
                        className="cursor-pointer"
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
            Weight of Fish Sampled
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="weightOfFishSampled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={
                      'focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
                    }
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Input weight of fish"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '')
                          field.onChange(value)
                        }}
                        className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="border-l border-neutral-200 bg-neutral-100 text-xs text-[#737780]">
                      <Select onValueChange={(value) => setWeightOfFishScale(value)}>
                        <SelectTrigger className="text-disabled border-0 bg-neutral-100 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="g" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
        {/* Current average body weight */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Current average body weight
            <span className="font-bold text-red-500">*</span>
          </Text>
          <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
            <div className="w-full">
              <Input
                placeholder="Current average body weight"
                className="bg-neutral-100"
                disabled
                readOnly
                value={currentAvgWeight.toFixed(4)}
              />
            </div>
            <div className="border-l border-neutral-200 bg-neutral-100 text-xs text-[#737780]">
              <Select>
                <SelectTrigger className="text-disabled border-0 bg-neutral-100 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Initial average body weight */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Initial average body weight
          </Text>
          <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
            <div className="w-full">
              <Input
                placeholder="Initial average body weight"
                className="bg-neutral-100"
                disabled
                readOnly
                value={initialWeightInGrams.toFixed(2)}
              />
            </div>
            <div className="border-l border-neutral-200 bg-neutral-100 text-xs text-[#737780]">
              <Select>
                <SelectTrigger className="text-disabled border-0 bg-neutral-100 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Third row - Total fish and Average weight gain */}
      <div className="flex w-full items-start gap-5">
        {/* Total number of fish in pond */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Total number of fish in pond
          </Text>
          <Input placeholder="Total fish count" className="bg-neutral-100" disabled readOnly value={totalFishInPond} />
        </div>

        {/* Average Weight gain */}
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">Average Weight gain</Text>
          <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
            <div className="w-full">
              <Input
                placeholder="Average Weight gain"
                className="bg-neutral-100"
                disabled
                readOnly
                value={avgWeightGain.toFixed(4)}
              />
            </div>
            <div className="border-l border-neutral-200 bg-neutral-100 text-xs text-[#737780]">
              <Select>
                <SelectTrigger className="text-disabled border-0 bg-neutral-100 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth row - Total weight gain */}
      <div className="flex w-full items-start gap-5">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">Total weight gain</Text>
          <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
            <div className="w-full">
              <Input
                placeholder="Total weight gain"
                className="bg-neutral-100"
                disabled
                readOnly
                value={totalWeightGain.toFixed(2)}
              />
            </div>
            <div className="border-l border-neutral-200 bg-neutral-100 text-xs text-[#737780]">
              <Select>
                <SelectTrigger className="text-disabled border-0 bg-neutral-100 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </FlexBox>
  )
}
