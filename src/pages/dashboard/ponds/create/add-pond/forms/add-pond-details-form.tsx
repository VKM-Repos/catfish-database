import { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'

type PondFormValues = z.infer<typeof pondSchema>

export default function AddPondDetailsForm({ form }: { form: UseFormReturn<PondFormValues> }) {
  const waterSources = ['Treated pipe borne water', 'Streams', 'Bore holes', 'Wells', 'Rivers']
  const pondTypes = ['Concrete', 'Earthen']
  const isWaterSourcesLoading = false
  const isPondTypesLoading = false

  return (
    <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond Name
          <span className="font-bold text-red-500">*</span>
        </Text>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="e.g Pond 1A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond Size
          <span className="gap-2 font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                  <div className="w-full">
                    <Input
                      placeholder="e.g 500 m²"
                      {...field}
                      className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="h-full bg-[#651391] px-3 py-[.65rem] text-sm text-white">m²</div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Water Source
          <span className="font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="waterSource"
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
                      <SelectValue placeholder="Select Source" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {isWaterSourcesLoading ? (
                      <SelectItem value="loading" disabled>
                        <Text>Loading sources...</Text>
                      </SelectItem>
                    ) : (
                      waterSources?.map((source, index) => (
                        <SelectItem key={index} value={source}>
                          {source}
                        </SelectItem>
                      ))
                    )}
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
          Pond Type
          <span className="font-bold text-red-500">*</span>
          <span className="ml-2">
            <SolarIconSet.QuestionCircle size={16} />
          </span>
        </Text>
        <FormField
          control={form.control}
          name="pondType"
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
                      <SelectValue placeholder="Select pond type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {isPondTypesLoading ? (
                      <SelectItem value="loading" disabled>
                        <Text>Loading types...</Text>
                      </SelectItem>
                    ) : (
                      pondTypes?.map((pond, index) => (
                        <SelectItem key={index} value={pond}>
                          {pond}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FlexBox>
  )
}
