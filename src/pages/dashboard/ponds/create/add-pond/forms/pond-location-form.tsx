import { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import { pondSchema } from 'src/schemas'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Loader } from 'src/components/ui/loader'

type PondFormValues = z.infer<typeof pondSchema>

export default function PondLocationForm({ form }: { form: UseFormReturn<PondFormValues> }) {
  const [positionError, setPositionError] = useState<string | null>(null)
  const [positionLoading, setPositionLoading] = useState(false)

  const handleGetLocation = () => {
    const MIN_LOADING_TIME = 800
    const start = Date.now()

    setPositionLoading(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const elapsed = Date.now() - start
          const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0)

          setTimeout(() => {
            form.setValue('latitude', String(position.coords.latitude))
            form.setValue('longitude', String(position.coords.longitude))
            form.trigger(['latitude', 'longitude'])

            setPositionLoading(false)
            setPositionError(null)
          }, remaining)
        },
        (error) => {
          const elapsed = Date.now() - start
          const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0)

          setTimeout(() => {
            setPositionLoading(false)
            setPositionError(error.message)
          }, remaining)
          alert(positionError)
        },
      )
    } else {
      setTimeout(() => {
        setPositionLoading(false)
        setPositionError('Geolocation is not supported by this browser.')
      }, MIN_LOADING_TIME)
    }
  }

  return (
    <FlexBox gap="gap-5" direction="col" className="w-full">
      <div className="flex w-full flex-col gap-2 border-neutral-200">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          Pond cluster
          <span className="font-bold text-red-500">*</span>
          <SolarIconSet.QuestionCircle size={16} />
        </Text>
        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="e.g cluster" {...field} className="bg-neutral-100 !py-3" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FlexBox justify="between" align="end" className="mb-3 w-full flex-col md:!flex-row">
        <FlexBox gap="gap-4" className="w-full flex-col md:!flex-row">
          <div className="flex w-full flex-col gap-2">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              {' '}
              Gps Longitude
              <span className="font-bold text-red-500">*</span>
              <SolarIconSet.QuestionCircle size={16} />
            </Text>
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="w-full !space-y-0">
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="flex h-full items-center gap-2 rounded-l-md bg-neutral-100 px-3 py-[.65rem] text-sm">
                        Longitude
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="e.g -44.4409092"
                          {...field}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <div className={`relative min-h-fit`}>
                    <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Gps Latitude
              <span className="font-bold text-red-500">*</span>
              <SolarIconSet.QuestionCircle size={16} />
            </Text>
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="w-full !space-y-0">
                  <FormControl>
                    <div className="focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                      <div className="h-full rounded-l-md bg-neutral-100 px-3 py-[.65rem] text-sm">Latitude</div>
                      <div className="w-full">
                        <Input
                          placeholder="e.g 110.84933"
                          {...field}
                          className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <div className={`relative min-h-fit`}>
                    <FormMessage className="absolute mt-2 transition-opacity duration-200" />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </FlexBox>
        <Button
          variant="ghost"
          type="button"
          onClick={handleGetLocation}
          className="flex h-fit w-full items-start justify-start gap-2 text-primary-400  md:max-w-[11rem]"
          disabled={positionLoading}
        >
          {positionLoading ? (
            <>
              <Loader type="spinner" size={24} />
              <Text size="sm" color="text-inherit" variant="body">
                Updating
              </Text>
            </>
          ) : (
            <>
              <SolarIconSet.MapPointAdd size={24} className="text-primary-500" />
              <Text size="sm" color="text-inherit" variant="body">
                use current location
              </Text>
            </>
          )}
        </Button>
      </FlexBox>
    </FlexBox>
  )
}
