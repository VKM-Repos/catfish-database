'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { harvestSchema } from 'src/schemas'
import type { z } from 'zod'
// Import useEffect
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'

export function HarvestForm({ handlePrevious }: { handlePrevious: () => void; handleNext: () => void }) {
  const form = useForm<z.infer<typeof harvestSchema>>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      numberOfFishHarvested: '',
      avgWeightOfFishHarvested: '',
      totalWeightHarvested: '',
      totalAmountSold: '',
      harvestObservation: '',
      harvestedBy: '',
    },
  })

  function onSubmit(data: z.infer<typeof harvestSchema>) {
    console.log(data)
    // handleNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <div className="p-5">
            <h5 className="text-[1.5rem] font-bold text-[#444955]">Harvest Report</h5>
            <p className="text-xs font-medium">Collect measurements on a sample of fish to gauge growth.</p>
          </div>
          <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5">
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-500">Number of Fish Harvested</Text>
              <FormField
                control={form.control}
                name="numberOfFishHarvested"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Input number of fish harvested" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full items-center gap-5">
              <div className="flex w-full flex-col gap-2">
                <Text className="text-sm font-medium text-neutral-500">Avg. Weight of Fish Harvested</Text>
                <FormField
                  control={form.control}
                  name="avgWeightOfFishHarvested"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Input  avg. Weigh of fish sampled" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Text className="text-sm font-medium text-neutral-500">Total weight Harvested</Text>
                <FormField
                  control={form.control}
                  name="totalWeightHarvested"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Weight Harvested" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full items-center gap-5">
              <div className="flex w-full flex-col gap-2">
                <Text className="text-sm font-medium text-neutral-500">Total amount sold</Text>
                <FormField
                  control={form.control}
                  name="totalAmountSold"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Amount in naira" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Text className="text-sm font-medium text-neutral-500">Harvest Notes / Observation</Text>
                <FormField
                  control={form.control}
                  name="harvestObservation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Other observations during sorting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Text className="text-sm font-medium text-neutral-500">Harvested by</Text>
              <FormField
                control={form.control}
                name="harvestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Who conducted this harvest" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
