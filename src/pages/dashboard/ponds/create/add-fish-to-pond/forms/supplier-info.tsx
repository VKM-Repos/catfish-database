import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'

export default function SupplierInfoForm({ form }: { form: UseFormReturn<any> }) {
  return (
    <FlexBox direction="col" gap="gap-2" className="w-full">
      <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
        Supplier
        <span className="gap-2 font-bold text-red-500">*</span>
        <SolarIconSet.QuestionCircle size={16} />
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
