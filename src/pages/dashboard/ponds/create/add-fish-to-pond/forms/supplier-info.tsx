import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/ui/tooltip'

export default function SupplierInfoForm({ form }: { form: UseFormReturn<any> }) {
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
    <FlexBox direction="col" gap="gap-2" className="w-full">
      <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
        Supplier
        <span className="gap-2 font-bold text-red-500">*</span>
        <FormTooltip text="The name of the farm or company that supplied the fish." />
      </Text>
      <FormField
        control={form.control}
        name="supplier"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input placeholder="From whom" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FlexBox>
  )
}
