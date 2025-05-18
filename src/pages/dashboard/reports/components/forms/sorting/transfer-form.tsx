import type { UseFormReturn } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Text } from 'src/components/ui/text'
import type { sortingSchema } from 'src/schemas'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { useParams } from 'react-router-dom'
import { useFishSortingStore } from 'src/store/fish-sorting.store'

type SortingFormValues = z.infer<typeof sortingSchema>

export default function TransferForm({ form }: { form: UseFormReturn<SortingFormValues> }) {
  const { formData, setFormData } = useFishSortingStore()
  const { watch, reset, control } = form

  // Update store when form changes
  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as SortingFormValues)
    })
    return () => subscription.unsubscribe()
  }, [watch, setFormData])
  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds'],
  })
  const { id } = useParams<{ id: string }>()

  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'batches',
  })

  // Ensure at least one batch exists when reason is transfer
  useEffect(() => {
    if (fields.length === 0 && form.getValues('reason') === 'transfer') {
      append({ quantity: 0, pondId: '' }, { shouldFocus: false })
    }
  }, [append, fields.length, form])

  const handleValueChange = (index: number, change: number) => {
    // Get the current value with a fallback to '0' if undefined
    const currentValueStr = form.getValues(`batches.${index}.quantity`) || 0

    // Parse the string to number (using + operator for simplicity)
    const currentValue = +currentValueStr // or Number(currentValueStr)

    const newValue = Math.max(0, currentValue + change)
    form.setValue(`batches.${index}.quantity`, newValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }
  const filteredPonds = ponds.content?.filter((pond: any) => pond.id !== id) || []

  return (
    <FlexBox gap="gap-5" direction="col" align="start" className="w-full">
      <div className="p-5">
        <h5 className="text-[1.5rem] font-bold text-[#444955]">Transfer</h5>
        <p className="text-xs font-medium">
          Log any fish you&apos;re relocating to other pond(s). For each transfer, specify how many fish and the
          destination pond.
        </p>
      </div>

      <div className="w-full rounded-lg border border-neutral-200 p-5">
        {fields.map((field, index) => (
          <div key={field.id} className="mb-5 w-full space-y-5">
            <div className="flex w-full items-center justify-end">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <SolarIconSet.CloseCircle size={16} />
                </Button>
              )}
            </div>

            <div className="flex w-full items-start gap-5">
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  No of fish Moved <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name={`batches.${index}.quantity`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className={`focus-within:ring-offset-background flex max-h-fit w-full items-center rounded-md border ${
                            fieldState.error ? 'border-red-500' : 'border-neutral-200'
                          } focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                        >
                          <div className="w-full">
                            <Input
                              placeholder="Input number of fish moved"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                field.onChange(value)
                              }}
                              className="!w-full border-0 px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <div className="flex h-10 w-10 flex-col items-center justify-center border border-b-0 border-r-0 border-t-0 border-neutral-200 text-xs">
                            <SolarIconSet.AltArrowUp
                              onClick={() => handleValueChange(index, 1)}
                              className="cursor-pointer hover:text-primary-500"
                            />
                            <div className="w-full border border-l-0 border-r-0 border-t-0 border-neutral-200" />
                            <SolarIconSet.AltArrowDown
                              onClick={() => handleValueChange(index, -1)}
                              className="cursor-pointer hover:text-primary-500"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  Destination Pond <span className="font-bold text-red-500">*</span>
                  <SolarIconSet.QuestionCircle size={16} />
                </Text>
                <FormField
                  control={form.control}
                  name={`batches.${index}.pondId`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <div className="flex items-center justify-center gap-3 text-neutral-300">
                              <SolarIconSet.Water color="text-inherit" size={24} iconStyle="Outline" />
                              <SelectValue placeholder="Select a pond" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingPonds ? (
                              <SelectItem value="loading" disabled>
                                <Text>Loading ponds...</Text>
                              </SelectItem>
                            ) : (
                              filteredPonds?.map((pond: any) => (
                                <SelectItem key={pond.id} value={pond.id}>
                                  {pond.name}
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
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-3 gap-3 font-medium"
          onClick={() => append({ quantity: '', pondId: '' })}
        >
          <span>
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                fill="#651391"
              />
              <path
                d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                fill="#1C274C"
              />
            </svg>
          </span>
          Add another Transfer
        </Button>
      </div>
    </FlexBox>
  )
}
