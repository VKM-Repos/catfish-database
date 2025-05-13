import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'

export default function FishDetailsForm({ form, fishSizes }: { form: UseFormReturn<any>; fishSizes: string[] }) {
  return (
    <>
      <FlexBox gap="gap-4" align="center" className="w-full flex-col md:flex-row">
        <div className="flex w-full flex-col gap-2">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            Quantity of fish supplied
            <span className="gap-2 font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="!space-y-0">
                <FormControl>
                  <Input placeholder="Input number of fish added to pond" {...field} type="number" />
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
            <SolarIconSet.QuestionCircle size={16} />
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
                    <SelectContent>
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
          Fish Description
          <span className="gap-2 font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
        <FormField
          control={form.control}
          name="fishDescription"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Input description of fish added to pond" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
