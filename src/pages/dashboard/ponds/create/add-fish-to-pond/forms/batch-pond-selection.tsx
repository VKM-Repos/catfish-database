import { UseFormReturn } from 'react-hook-form'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'src/components/ui/command'
import { cn } from 'src/lib/utils'
import { useState } from 'react'

export default function BatchPondSelection({ form, pondNames }: { form: UseFormReturn<any>; pondNames: string[] }) {
  const FormTooltip = ({ text }: { text: string }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <SolarIconSet.QuestionCircle size={16} />
          </TooltipTrigger>
          <TooltipContent>{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  const [openCommand, setOpenCommand] = useState(false)
  const [value, setValue] = useState('')
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Batch name
          <span className="gap-2 font-bold text-red-500">*</span>
          {/* <SolarIconSet.QuestionCircle size={16} /> */}
        </Text>
        <FormField
          control={form.control}
          name="batchName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name your batch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Text className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Select the pond to which you want to add the fish
          <span className="gap-2 font-bold text-red-500">*</span>
          <FormTooltip text="Select the pond where you want to add the fish batch. This is required." />
        </Text>
        <FormField
          control={form.control}
          name="pondId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Popover open={openCommand} onOpenChange={setOpenCommand}>
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCommand}
                      className="w-full justify-between border-neutral-200 py-2 text-neutral-500"
                    >
                      <div className="flex items-center gap-5">
                        {' '}
                        <SolarIconSet.Water color="text-inherit" size={24} iconStyle="Outline" />
                        {value ? pondNames?.find((name: string) => name === value) : 'Select Pond'}
                      </div>
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[2000] w-[600px]">
                    <Command>
                      <CommandInput placeholder="Search pond..." className="h-9" />
                      <CommandList className="z-[2000]">
                        <CommandEmpty>No pond found.</CommandEmpty>
                        <CommandGroup>
                          {pondNames?.map((name: string) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? '' : currentValue)
                                setOpenCommand(false)
                                field.onChange(name)
                                form.trigger('pondId')
                              }}
                            >
                              {name}
                              <Check className={cn('ml-auto', value === name ? 'opacity-100' : 'opacity-0')} />
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
      </div>
    </>
  )
}
