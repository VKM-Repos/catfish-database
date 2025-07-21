import { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Grid } from 'src/components/ui/grid'

type PondFormValues = z.infer<typeof pondSchema>

export default function PondDetailsForm({ form }: { form: UseFormReturn<PondFormValues> }) {
  const waterSources = ['Treated pipe borne water', 'Streams', 'Bore holes', 'Wells', 'Rivers']
  const pondTypes = ['Concrete', 'Earthen', 'Plastic', 'Tarpauline']
  const isWaterSourcesLoading = false
  const isPondTypesLoading = false

  // console.log('test: ', form)
  return (
    <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond Name
          <span className="font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
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

      <div className="flex w-full flex-col gap-1">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond Size
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
        <Grid cols={3} gap="gap-2" className="!grid-cols-1 md:!grid-cols-3">
          <FlexBox direction="col" gap="gap-2">
            <Text className="flex items-center gap-2 text-xs font-medium text-neutral-700">
              Length
              <span className="gap-2 font-bold text-red-500">*</span>
            </Text>
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="w-full">
                        <Input
                          placeholder="Input pond length"
                          {...field}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="h-full rounded-r-md bg-neutral-100 px-3 py-[.65rem] text-sm">FT</div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FlexBox>
          <FlexBox direction="col" gap="gap-2">
            <Text className="flex items-center gap-2 text-xs font-medium text-neutral-700">
              Breadth
              <span className="gap-2 font-bold text-red-500">*</span>
            </Text>
            <FormField
              control={form.control}
              name="breadth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="w-full">
                        <Input
                          placeholder="Input pond breadth"
                          {...field}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="h-full rounded-r-md bg-neutral-100 px-3 py-[.65rem] text-sm">FT</div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FlexBox>
          <FlexBox direction="col" gap="gap-2" className="w-full">
            <Text className="flex items-center gap-2 text-xs font-medium text-neutral-700">
              Depth
              <span className="gap-2 font-bold text-red-500">*</span>
            </Text>
            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="w-full">
                        <Input
                          placeholder="Input pond depth"
                          {...field}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="h-full rounded-r-md bg-neutral-100 px-3 py-[.65rem] text-sm">FT</div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FlexBox>
        </Grid>
      </div>

      <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
        <FlexBox direction="col" gap="gap-2" className="w-full">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Water Source
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="waterSource"
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
        </FlexBox>
        <FlexBox direction="col" gap="gap-2" className="w-full">
          <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            Pond Type
            <span className="font-bold text-red-500">*</span>
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="pondType"
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
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}
