import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/ui/tooltip'

import { formatCurrency } from 'src/lib/utils'

export default function CostDetailsForm({ form }: { form: UseFormReturn<any> }) {
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
    <FlexBox gap="gap-4" align="center" className="w-full flex-col md:flex-row">
      <FlexBox gap="gap-2" direction="col" className="w-full">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Cost of fish per unit
          <span className="gap-2 font-bold text-red-500">*</span>
          <FormTooltip text="Enter the price per fish in Naira. This will be used to calculate your total fish cost." />
        </Text>
        <FormField
          control={form.control}
          name="singleCost"
          render={({ field }) => (
            <FormItem className="w-full !space-y-0">
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm">₦</div>
                  <div className="w-full">
                    <Input
                      placeholder="Amount in naira"
                      value={formatCurrency(field.value)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '')
                        field.onChange(rawValue)
                      }}
                      className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </FormControl>
              <div className={`relative min-h-fit`}>
                <FormMessage className="absolute my-2 transition-opacity duration-200" />
              </div>
            </FormItem>
          )}
        />
      </FlexBox>
      <FlexBox gap="gap-2" direction="col" className="w-full">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Total Cost
          <span className="gap-2 font-bold text-red-500">*</span>
          <FormTooltip text="This is the total amount spent on purchasing the fish. It is calculated by multiplying the quantity by the unit cost." />
        </Text>
        <FormField
          control={form.control}
          name="costOfSupply"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm">₦</div>
                  <div className="w-full">
                    <Input
                      {...field}
                      value={formatCurrency(field.value)}
                      placeholder="Amount in naira"
                      className="!w-full border-0 px-3 text-sm !text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FlexBox>
    </FlexBox>
  )
}
