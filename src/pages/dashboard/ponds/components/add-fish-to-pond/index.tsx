import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { fishDetailsSchema } from 'src/schemas'
import { usePondStore } from 'src/store/pond.store'
import { z } from 'zod'

export default function AddFishPond({ handleNext }: { handleNext: () => void }) {
  const { pondData, setPondStore } = usePondStore()
  const ponds = ['Pond 1A', 'Pond 1B', 'Pond 2A', 'Pond 2B']

  const form = useForm({
    resolver: zodResolver(fishDetailsSchema),
    defaultValues: {
      fishPond: '',
      fishQuantity: '',
      fishCost: '',
      fishDescription: '',
      fishSize: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: z.infer<typeof fishDetailsSchema>) => {
    try {
      setPondStore({
        ...pondData,
        fishPond: values.fishPond,
        fishQuantity: values.fishQuantity,
        fishCost: values.fishCost,
        fishDescription: values.fishDescription,
        fishSize: values.fishSize,
      })
      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="w-full">
      <div className="mb-2 w-full items-start gap-1">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish Details</h5>
        <hr className="w-full border border-primary-200" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
          <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-600">
                Select the pond to which you want to add the field
              </Text>
              <FormField
                control={form.control}
                name="fishPond"
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
                            <SelectValue placeholder="Select pond" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {ponds?.map((pond, index) => (
                            <SelectItem key={index} value={pond}>
                              {pond}
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
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-600">Quantity of fish supplied</Text>
              <FormField
                control={form.control}
                name="fishQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Input number of fish added to pond" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-600">Fish Size</Text>
              <FormField
                control={form.control}
                name="fishSize"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Input size of fish" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-600">Fish Description</Text>
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
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-600">Cost of fish</Text>
              <FormField
                control={form.control}
                name="fishCost"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                        <div className="h-full bg-neutral-100 px-3 py-[.65rem] text-sm text-neutral-500">₦</div>
                        <div className="w-full">
                          <Input
                            placeholder="Amount in naira"
                            {...field}
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
          </FlexBox>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
            disabled={!form.formState.isValid}
          >
            Continue
          </Button>
        </form>
      </Form>
    </FlexBox>
  )
}
