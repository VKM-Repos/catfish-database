import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { maintenanceSchema } from 'src/schemas'
import type { z } from 'zod'

export default function MaintenanceForm({
  handleNext,
  handlePrevious,
}: {
  handleNext: () => void
  handlePrevious: () => void
}) {
  const maintenances = ['Cleaning A', 'Cleaning B', 'Cleaning C', 'Cleaning D']

  const form = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      maintenance: '',
      cost: 0,
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: z.infer<typeof maintenanceSchema>) => {
    try {
      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="w-full rounded-md border border-neutral-300 py-5">
      <div className="mb-2 w-full items-start gap-1">
        <h5 className="px-5 text-[1.5rem] font-bold text-[#444955]">Daily Maintenance</h5>
        <hr className="w-full border border-primary-200" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center space-y-8 ">
          <FlexBox gap="gap-5" direction="col" align="center" className="w-full px-5">
            <div className="flex w-full gap-5">
              <div className="flex w-full flex-col gap-2">
                <Text className="text-sm font-medium text-neutral-600">Maintenance</Text>
                <FormField
                  control={form.control}
                  name="maintenance"
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
                              <SelectValue placeholder="Select maintenance type" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {maintenances?.map((maintenance) => (
                              <SelectItem key={maintenance} value={maintenance}>
                                {maintenance}
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
                <Text className="text-sm font-medium text-neutral-600">Maintenance Cost Incurred</Text>
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                          <div className="h-full bg-primary-500 px-3 py-[.65rem] text-xs text-white">&#8358;</div>
                          <div className="w-full">
                            <Input
                              placeholder="Input cost"
                              {...field}
                              className="border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                field.onChange(value)
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FlexBox>
          <div className="mt-10 flex w-full justify-between bg-neutral-100 px-5 py-3 ">
            <Button type="button" onClick={handlePrevious} variant="outline" className="flex items-center gap-2">
              back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </FlexBox>
  )
}
