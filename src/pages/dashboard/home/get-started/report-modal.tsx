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

type FormValues = {
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

  const form = useForm<FormValues>({
    defaultValues: { pondId: '' },
    mode: 'onChange',
  })

  const handleProceed = (values: FormValues) => {
    if (!values.pondId) return
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[290px] w-[650px] overflow-hidden p-4">
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
              name="pondId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-start space-x-2 text-neutral-300">
                    <Text>Pond Name</Text>{' '}
                    <SolarIconSet.QuestionCircle color="text-inherit" size={16} iconStyle="Outline" />
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
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
                          ponds.content?.map((pond: any) => (
                            <SelectItem key={pond.id} value={pond.id}>
                              {pond.name}
                            </SelectItem>
                          ))
                        )}
                        {isLoadingClustersManagerPonds ? (
                          <SelectItem value="loading" disabled>
                            <Text>Loading ponds...</Text>
                          </SelectItem>
                        ) : (
                          clustersManagerPonds.content?.map((pond: any) => (
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
