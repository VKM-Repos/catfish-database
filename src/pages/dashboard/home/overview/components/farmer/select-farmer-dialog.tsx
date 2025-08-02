import { Dialog, DialogContent, DialogHeader, DialogClose } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from 'src/components/ui/form'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'src/components/ui/command'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from 'src/lib/utils'
import { useState } from 'react'

type FormValues = {
  farmerId: string
}

type SelectFarmerDialogProps = {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SelectFarmerDialog({ title, open, onOpenChange }: SelectFarmerDialogProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const useGetFarmers = createGetQueryHook({
    endpoint: '/users/farmers?direction=DESC',
    responseSchema: z.any(),
    queryKey: ['my-farmers'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })

  const { data: farmers = [], isLoading: isLoadingFarmers } = useGetFarmers()

  const form = useForm<FormValues>({
    defaultValues: { farmerId: '' },
    mode: 'onSubmit', // validate on submit
  })

  const handleProceed = (values: FormValues) => {
    console.log('proceed')
    if (user?.id)
      navigate(
        `${paths.dashboard.ponds.create.addPond}?farmerId=${encodeURIComponent(form.getValues('farmerId'))}&clusterId=${
          user?.cluster.id
        }&from=overview`,
      )
  }
  const [openCommand, setOpenCommand] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[350px] overflow-hidden p-4 lg:w-[650px]">
        <DialogHeader className="absolute flex w-full flex-row items-center justify-between border-b border-b-neutral-100 p-2 px-4">
          <Heading level={6}>{title}</Heading>
          <DialogClose className="flex justify-end">
            <SolarIconSet.CloseCircle color="text-inherit" size={24} iconStyle="Outline" />
          </DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProceed)} className="space-y-4 py-[5rem]">
            <FormField
              control={form.control}
              name="farmerId"
              rules={{ required: 'Pond is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-start space-x-2 text-neutral-300">
                    <Text>Select the farmer</Text>{' '}
                  </FormLabel>
                  <FormControl>
                    <Popover open={openCommand} onOpenChange={setOpenCommand}>
                      <PopoverTrigger className="w-full" asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between border-neutral-200 py-2 text-neutral-500"
                        >
                          <div className="flex items-center gap-5">
                            {' '}
                            <SolarIconSet.User color="text-inherit" size={24} iconStyle="Outline" />
                            {value
                              ? (() => {
                                  const selectedFarmer = farmers.content?.find(
                                    (farmer: any) => farmer.firstName === value,
                                  )
                                  return selectedFarmer
                                    ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}`
                                    : 'Select Pond'
                                })()
                              : 'Select Pond'}
                          </div>
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-[2000] w-[600px]">
                        <Command>
                          <CommandInput placeholder="Search pond..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No pond found.</CommandEmpty>
                            <CommandGroup>
                              {user?.role === 'CLUSTER_MANAGER' &&
                                farmers.content?.map((farmer: any) => (
                                  <CommandItem
                                    key={farmer.id}
                                    value={farmer.firstName}
                                    onSelect={(currentValue: string) => {
                                      setValue(currentValue === value ? '' : currentValue)
                                      setOpenCommand(false)
                                      field.onChange(farmer.id)
                                      form.trigger('farmerId')
                                    }}
                                  >
                                    {(farmer as { firstName: string }).firstName}{' '}
                                    {(farmer as { lastName: string }).lastName}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        value === farmer.firstName ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="absolute bottom-0 left-0 flex w-full justify-between bg-[#F9F9F9] px-4 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={!form.formState.isValid}>
                Proceed
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
