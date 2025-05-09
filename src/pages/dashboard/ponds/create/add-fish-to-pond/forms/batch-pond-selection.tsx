import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'

export default function BatchPondSelection({ form, pondNames }: { form: UseFormReturn<any>; pondNames: string[] }) {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Batch name
          <span className="gap-2 font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
        <FormField
          control={form.control}
          name="batchName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name your batch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Select the pond to which you want to add the field
          <span className="gap-2 font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
        <FormField
          control={form.control}
          name="pondId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="font-light">
                    <div className="flex items-center justify-center gap-2">
                      <SelectValue placeholder="Select pond" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {pondNames?.map((name: string, index: number) => (
                      <SelectItem key={index} value={name}>
                        {name}
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
    </>
  )
}
