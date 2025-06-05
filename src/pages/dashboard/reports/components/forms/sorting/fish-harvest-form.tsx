import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { sortingSchema } from 'src/schemas'
import type { z } from 'zod'
import { useRef, useState } from 'react'
import * as SolarIconSet from 'solar-icon-set'
import { useFishHarvestStore } from 'src/store/fish-harvest-store'

type SortingFormValues = z.infer<typeof sortingSchema>

export default function FishHarvestForm({ form }: { form: UseFormReturn<SortingFormValues> }) {
  const timeInputRef = useRef<HTMLInputElement>(null)
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  // Get values and actions from the store
  const {
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    totalWeightHarvested,
    setTotalWeightHarvested,
    totalAmountSold,
    setTotalAmountSold,
    costPerKg,
    setCostPerKg,
  } = useFishHarvestStore()

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
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full ">
      <div className="p-5">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Harvest</h5>
        <p className="text-xs font-medium">
          Record the number of fish you are removing from this batch for harvest today. This will update your remaining
          stock automatically.
        </p>
      </div>
      <div className="flex w-full flex-col gap-5 rounded-lg border border-neutral-200 p-5">
        <div className="flex w-full items-center gap-5">
          <div className="flex w-full flex-col gap-2">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Number of Fish Harvested
              <SolarIconSet.QuestionCircle size={16} />
              <Text className="font-light text-neutral-500">(Optional)</Text>
            </Text>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="w-full">
                        <Input
                          placeholder="Input number of fish harvested"
                          value={quantity}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            setQuantity(value)
                            field.onChange(value)
                          }}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs">
                        <SolarIconSet.AltArrowUp
                          onClick={() => {
                            incrementQuantity()
                            field.onChange((Number.parseInt(quantity || '0', 10) + 1).toString())
                          }}
                          className="cursor-pointer"
                        />
                        <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200 " />
                        <SolarIconSet.AltArrowDown
                          onClick={() => {
                            decrementQuantity()
                            field.onChange(Math.max(0, Number.parseInt(quantity || '0', 10) - 1).toString())
                          }}
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
              Total weight Harvested
              <SolarIconSet.QuestionCircle size={16} />
              <Text className="font-light text-neutral-500">(Optional)</Text>
            </Text>
            <FormField
              control={form.control}
              name="totalWeightHarvested"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Weight Harvested"
                      value={totalWeightHarvested}
                      onChange={(e) => {
                        setTotalWeightHarvested(e.target.value)
                        field.onChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-5">
          <div className="flex w-full flex-col gap-2">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Total amount sold
              <span className="font-bold text-red-500">*</span>
              <SolarIconSet.QuestionCircle size={16} />
            </Text>
            <FormField
              control={form.control}
              name="costPerKg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                        activeInputs.costPerKg ? 'bg-neutral-100' : ''
                      } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                    >
                      <div
                        className={`h-10 rounded-bl-md rounded-tl-md px-3 py-[.65rem] text-xs ${
                          activeInputs.costPerKg ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        &#8358;
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="Amount in naira"
                          value={costPerKg}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            setCostPerKg(value)
                            field.onChange(value)
                            handleInputChange('costPerKg', value)
                          }}
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
        </div>
      </div>
    </FlexBox>
  )
}
