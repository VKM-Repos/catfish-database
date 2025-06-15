// src/components/dialogs/ReportModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogClose } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { useForm } from 'react-hook-form'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from 'src/components/ui/select'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from 'src/components/ui/form'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { useAuthStore } from 'src/store/auth.store'
import { Input } from 'src/components/ui/input'
import { useRef, useState } from 'react'

type FormValues = {
  date: string
  pondId: string
}

type ReportModalProps = {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  redirect: string
}

export function ReportModal({ title, open, redirect, onOpenChange }: ReportModalProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const timeInputRef = useRef<HTMLInputElement>(null)
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds'],
    options: {
      enabled: user?.role === 'FARMER',
    },
  })

  const useGetPondByClusterManager = createGetQueryHook({
    endpoint: '/ponds/clusters/me',
    responseSchema: z.any(),
    queryKey: ['ponds_for_cluster_manager'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })
  const { data: clustersManagerPonds = [], isLoading: isLoadingClustersManagerPonds } = useGetPondByClusterManager()
  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const currentDate = `${yyyy}-${mm}-${dd}`

  const form = useForm<FormValues>({
    defaultValues: { pondId: '', date: currentDate },
    mode: 'onSubmit', // validate on submit
  })

  const handleProceed = (values: FormValues) => {
    if (!values.pondId || !values.date) return
    if (values.pondId === 'add-pond') {
      return navigate(paths.dashboard.ponds.create.addPond)
    }
    // Perform action using values.pondId
    switch (redirect) {
      case 'daily-farm-report':
        navigate(paths.dashboard.reports.createDailyFarmReport(values.pondId))
        break
      case 'daily-sampling-report':
        navigate(paths.dashboard.reports.createSamplingReport(values.pondId))
        break
      case 'daily-harvest-report':
        navigate(paths.dashboard.reports.createHarvestReport(values.pondId))
        break
    }
    if (redirect === 'daily-farm-report') onOpenChange(false)
  }
  const handleIconClick = () => {
    timeInputRef.current?.showPicker()
  }
  const handleInputChange = (fieldName: string, value: string) => {
    setActiveInputs((prev) => ({
      ...prev,
      [fieldName]: value.trim().length > 0,
    }))
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[350px] w-[650px] overflow-hidden p-4">
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
              name="date"
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border ${
                        activeInputs.feedTime ? 'bg-primary-100' : ''
                      } border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 ${
                        form.formState.errors.date ? 'border-red-500' : ''
                      }`}
                    >
                      <div className="w-full">
                        <Input
                          data-placeholder={'Select date'}
                          type="date"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleInputChange('date', e.target.value)
                          }}
                          ref={timeInputRef}
                          className={`md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden ${
                            form.formState.errors.date ? 'ring-2 ring-red-500' : ''
                          }`}
                        />
                      </div>
                      <div
                        className={`h-10 cursor-pointer rounded-br-md rounded-tr-md px-3 py-[.65rem] text-xs ${
                          activeInputs.date ? 'bg-primary-500 text-white' : 'bg-primary-500 text-white'
                        }`}
                        onClick={handleIconClick}
                      >
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.5 14C18.0523 14 18.5 13.5523 18.5 13C18.5 12.4477 18.0523 12 17.5 12C16.9477 12 16.5 12.4477 16.5 13C16.5 13.5523 16.9477 14 17.5 14Z"
                            fill="white"
                          />
                          <path
                            d="M17.5 18C18.0523 18 18.5 17.5523 18.5 17C18.5 16.4477 18.0523 16 17.5 16C16.9477 16 16.5 16.4477 16.5 17C16.5 17.5523 16.9477 18 17.5 18Z"
                            fill="white"
                          />
                          <path
                            d="M13.5 13C13.5 13.5523 13.0523 14 12.5 14C11.9477 14 11.5 13.5523 11.5 13C11.5 12.4477 11.9477 12 12.5 12C13.0523 12 13.5 12.4477 13.5 13Z"
                            fill="white"
                          />
                          <path
                            d="M13.5 17C13.5 17.5523 13.0523 18 12.5 18C11.9477 18 11.5 17.5523 11.5 17C11.5 16.4477 11.9477 16 12.5 16C13.0523 16 13.5 16.4477 13.5 17Z"
                            fill="white"
                          />
                          <path
                            d="M7.5 14C8.05229 14 8.5 13.5523 8.5 13C8.5 12.4477 8.05229 12 7.5 12C6.94772 12 6.5 12.4477 6.5 13C6.5 13.5523 6.94772 14 7.5 14Z"
                            fill="white"
                          />
                          <path
                            d="M7.5 18C8.05229 18 8.5 17.5523 8.5 17C8.5 16.4477 8.05229 16 7.5 16C6.94772 16 6.5 16.4477 6.5 17C6.5 17.5523 6.94772 18 7.5 18Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5 1.75C7.91421 1.75 8.25 2.08579 8.25 2.5V3.26272C8.912 3.24999 9.64133 3.24999 10.4435 3.25H14.5564C15.3586 3.24999 16.088 3.24999 16.75 3.26272V2.5C16.75 2.08579 17.0858 1.75 17.5 1.75C17.9142 1.75 18.25 2.08579 18.25 2.5V3.32709C18.5099 3.34691 18.7561 3.37182 18.989 3.40313C20.1614 3.56076 21.1104 3.89288 21.8588 4.64124C22.6071 5.38961 22.9392 6.33855 23.0969 7.51098C23.25 8.65018 23.25 10.1058 23.25 11.9435V14.0564C23.25 15.8941 23.25 17.3498 23.0969 18.489C22.9392 19.6614 22.6071 20.6104 21.8588 21.3588C21.1104 22.1071 20.1614 22.4392 18.989 22.5969C17.8498 22.75 16.3942 22.75 14.5565 22.75H10.4436C8.60585 22.75 7.15018 22.75 6.01098 22.5969C4.83856 22.4392 3.88961 22.1071 3.14124 21.3588C2.39288 20.6104 2.06076 19.6614 1.90314 18.489C1.74997 17.3498 1.74998 15.8942 1.75 14.0564V11.9436C1.74998 10.1058 1.74997 8.65019 1.90314 7.51098C2.06076 6.33855 2.39288 5.38961 3.14124 4.64124C3.88961 3.89288 4.83856 3.56076 6.01098 3.40313C6.2439 3.37182 6.49006 3.34691 6.75 3.32709V2.5C6.75 2.08579 7.08579 1.75 7.5 1.75ZM6.21085 4.88976C5.20476 5.02502 4.62511 5.27869 4.2019 5.7019C3.77869 6.12511 3.52502 6.70476 3.38976 7.71085C3.36685 7.88123 3.3477 8.06061 3.33168 8.25H21.6683C21.6523 8.06061 21.6331 7.88124 21.6102 7.71085C21.475 6.70476 21.2213 6.12511 20.7981 5.7019C20.3749 5.27869 19.7952 5.02502 18.7892 4.88976C17.7615 4.75159 16.4068 4.75 14.5 4.75H10.5C8.59318 4.75 7.23851 4.75159 6.21085 4.88976ZM3.25 12C3.25 11.146 3.25032 10.4027 3.26309 9.75H21.7369C21.7497 10.4027 21.75 11.146 21.75 12V14C21.75 15.9068 21.7484 17.2615 21.6102 18.2892C21.475 19.2952 21.2213 19.8749 20.7981 20.2981C20.3749 20.7213 19.7952 20.975 18.7892 21.1102C17.7615 21.2484 16.4068 21.25 14.5 21.25H10.5C8.59318 21.25 7.23851 21.2484 6.21085 21.1102C5.20476 20.975 4.62511 20.7213 4.2019 20.2981C3.77869 19.8749 3.52502 19.2952 3.38976 18.2892C3.25159 17.2615 3.25 15.9068 3.25 14V12Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pondId"
              rules={{ required: 'Pond is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-start space-x-2 text-neutral-300">
                    <Text>Pond Name</Text>{' '}
                    <SolarIconSet.QuestionCircle color="text-inherit" size={16} iconStyle="Outline" />
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={form.formState.errors.pondId ? 'border-red-500 ring-2 ring-red-500' : ''}
                      >
                        <div className="flex items-center justify-center gap-3 text-neutral-300">
                          <SolarIconSet.Water color="text-inherit" size={24} iconStyle="Outline" />
                          <SelectValue placeholder="Select a pond" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {user?.role === 'FARMER' && isLoadingPonds ? (
                          <SelectItem value="loading" disabled>
                            <Text>Loading ponds...</Text>
                          </SelectItem>
                        ) : (
                          ponds.content?.map((pond: unknown) => (
                            <SelectItem key={(pond as { id: string }).id} value={(pond as { id: string }).id}>
                              {(pond as { name: string }).name}
                            </SelectItem>
                          ))
                        )}
                        {clustersManagerPonds.content?.map((pond: unknown) => (
                          <SelectItem key={(pond as { id: string }).id} value={(pond as { id: string }).id}>
                            {(pond as { name: string }).name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
