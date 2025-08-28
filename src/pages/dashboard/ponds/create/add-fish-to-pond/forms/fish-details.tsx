import { UseFormReturn } from 'react-hook-form'
import { Dispatch, SetStateAction } from 'react'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/ui/tooltip'

interface FishDetailsFormProps {
  form: UseFormReturn<any>
  fishSizes: string[]
  setAverageFishWeightScale: Dispatch<SetStateAction<string>>
  setTotalWeightOFishScale: Dispatch<SetStateAction<string>>
}

export default function FishDetailsForm({
  form,
  fishSizes,
  setAverageFishWeightScale,
  setTotalWeightOFishScale,
}: FishDetailsFormProps) {
  const FormTooltip = ({ text }: { text: string }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer">
              <SolarIconSet.QuestionCircle size={16} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <>
      <FlexBox gap="gap-4" align="center" className="w-full flex-col md:flex-row">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            Quantity of fish supplied
            <span className="gap-2 font-bold text-red-500">*</span>
            <FormTooltip text="Enter the total number of fish you are adding to the pond in this batch." />
          </Text>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="!space-y-0">
                <FormControl>
                  <Input
                    placeholder="Input number of fish added to pond"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <div className={`relative min-h-fit `}>
                  <FormMessage className="absolute my-2 transition-opacity duration-200" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            Fish Size
            <span className="gap-2 font-bold text-red-500">*</span>
            <FormTooltip text="Select the size category of the fish being stocked (e.g., fingerlings, juveniles)." />
          </Text>
          <FormField
            control={form.control}
            name="fishSize"
            render={({ field }) => (
              <FormItem className="!space-y-0">
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="font-light">
                      <div className="flex items-center justify-center gap-2">
                        <SelectValue placeholder="Select size of fish" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="z-[2000]">
                      {fishSizes?.map((fishSize, index) => (
                        <SelectItem key={index} value={fishSize}>
                          {fishSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className={`relative min-h-fit `}>
                  <FormMessage className="absolute my-2 transition-opacity duration-200" />
                </div>
              </FormItem>
            )}
          />
        </div>
      </FlexBox>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Initial average body weight (g)
          <span className="gap-2 font-bold text-red-500">*</span>
          <FormTooltip text="The average weight (in grams) of the fish when they arrived." />
        </Text>
        <FormField
          control={form.control}
          name="initialWeight"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-ful focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="w-full border-0 border-r">
                    <Input
                      placeholder="Input initial average body weight of fish in grams"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '')
                        field.onChange(value)
                      }}
                      className="!w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="bg-neutral-100">
                    <Select onValueChange={(value) => setAverageFishWeightScale(value)}>
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
    </>
  )
}
