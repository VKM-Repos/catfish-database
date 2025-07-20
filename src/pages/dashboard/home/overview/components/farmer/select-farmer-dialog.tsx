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
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-[650px] overflow-hidden p-4">
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={form.formState.errors.farmerId ? 'border-red-500 ring-2 ring-red-500' : ''}
                      >
                        <div className="flex items-center justify-center gap-3 text-neutral-300">
                          <SolarIconSet.User color="text-inherit" size={24} iconStyle="Outline" />
                          <SelectValue placeholder="Select farmer" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {user?.role === 'FARMER' && isLoadingFarmers ? (
                          <SelectItem value="loading" disabled>
                            <Text>Loading farmers...</Text>
                          </SelectItem>
                        ) : (
                          farmers.content?.map((farmer: unknown) => (
                            <SelectItem key={(farmer as { id: string }).id} value={(farmer as { id: string }).id}>
                              {(farmer as { firstName: string }).firstName} {(farmer as { lastName: string }).lastName}
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
