'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem } from 'src/components/ui/form'
import { Switch } from 'src/components/ui/switch'
import { Text } from 'src/components/ui/text'
import { sortingSchema } from 'src/schemas'
import type { z } from 'zod'
import { useEffect } from 'react' // Import useEffect
import TransferForm from './transfer-form'
import FishHarvestForm from './fish-harvest-form'

export function SortingForm({ handlePrevious }: { handlePrevious: () => void; handleNext: () => void }) {
  const form = useForm<z.infer<typeof sortingSchema>>({
    resolver: zodResolver(sortingSchema),
    defaultValues: {
      splitOccur: false,
      transfer: false,
      harvest: false,
    },
  })

  // Watch the harvest and transfer fields
  const harvestValue = form.watch('harvest')
  const transferValue = form.watch('transfer')

  // Effect to ensure harvest and transfer are mutually exclusive
  useEffect(() => {
    if (harvestValue && transferValue) {
      form.setValue('transfer', false)
    }
  }, [harvestValue, transferValue, form])

  // Effect to ensure transfer and harvest are mutually exclusive
  useEffect(() => {
    if (transferValue && harvestValue) {
      form.setValue('harvest', false)
    }
  }, [transferValue, harvestValue, form])

  function onSubmit(data: z.infer<typeof sortingSchema>) {
    console.log(data)
    // handleNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <div className="p-5">
            <h5 className="text-[1.5rem] font-bold text-[#444955]">Split occurrence</h5>
            <p className="text-xs font-medium">
              Indicate if you&apos;ve split the batch today whether harvesting some or moving fish to new ponds—and
              capture the details.
            </p>
          </div>
          <div className="space-y-4 rounded-lg border border-neutral-200 p-5">
            <FormField
              control={form.control}
              name="splitOccur"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-between shadow-sm">
                  <div className="space-y-0.5">
                    <FormDescription className="flex items-center gap-1">
                      Did split occur during sampling? <span className="text-xl text-error-500">*</span>
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span>No</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (!checked) {
                            form.setValue('transfer', false)
                            form.setValue('harvest', false)
                          }
                        }}
                      />
                      <span>Yes</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {form.getValues('splitOccur') && (
              <div className="item-center flex gap-5">
                <FormField
                  control={form.control}
                  name="transfer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="transfer"
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                form.setValue('harvest', false)
                              }
                            }}
                          />
                          <Text variant="label" size="base" weight="normal" color="text-neutral-400">
                            Transfer
                          </Text>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="harvest"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Text variant="label" size="base" weight="normal" color="text-neutral-400">
                            Harvest
                          </Text>
                          <Checkbox
                            id="harvest"
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                form.setValue('transfer', false)
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {form.getValues('splitOccur') && (
            <div className="mt-10">
              {form.getValues('transfer') && <TransferForm form={form} />}
              {form.getValues('harvest') && <FishHarvestForm form={form} />}
            </div>
          )}
        </div>
        <div className="flex justify-between bg-neutral-100 p-5">
          <Button variant={'outline'} onClick={handlePrevious}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  )
}
