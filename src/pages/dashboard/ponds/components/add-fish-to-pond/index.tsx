import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { fishDetailsSchema } from 'src/schemas'
import { usePondStore } from 'src/store/pond.store'
import { z } from 'zod'

export default function AddFishPond({ handleNext }: { handleNext: () => void }) {
  const { pondData, setPondStore } = usePondStore()

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
      <div className="mb-2 w-full items-start">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Fish Details</h5>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8">
          <FlexBox gap="gap-5" direction="col" align="center" className="w-full">
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-300">
                Select the pond to which you want to add the field
              </Text>
              <FormField
                control={form.control}
                name="fishPond"
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
              <Text className="text-sm font-medium text-neutral-300">Quantity of fish supplied</Text>
              <FormField
                control={form.control}
                name="fishQuantity"
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
              <Text className="text-sm font-medium text-neutral-300">Fish Size</Text>
              <FormField
                control={form.control}
                name="fishSize"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g Pond 1A" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-300">Fish Description</Text>
              <FormField
                control={form.control}
                name="fishDescription"
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
              <Text className="text-sm font-medium text-neutral-300">Cost of fish</Text>
              <FormField
                control={form.control}
                name="fishCost"
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
