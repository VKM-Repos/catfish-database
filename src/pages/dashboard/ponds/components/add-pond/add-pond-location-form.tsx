import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'

export default function AddPondLocationForm({ form }: { form: any }) {
  return (
    <FlexBox gap="gap-2" direction="col" className="w-full">
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Longitude</Text>
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
                  <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">Longitude</div>
                  <div className="w-full">
                    <Input placeholder="e.g Pond 1A" {...field} className="!w-full  border-[0] px-3 text-sm" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Latitude</Text>
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex max-h-fit items-center rounded-md border border-neutral-200">
                  <div className="h-full  bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">Latitude</div>
                  <div className="w-full">
                    <Input placeholder="e.g Pond 1A" {...field} className="!w-full  border-[0] px-3 text-sm" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="text-sm font-medium text-neutral-300">Pond cluster</Text>
        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="e.g cluster" {...field} className="!py-3" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FlexBox>
  )
}
