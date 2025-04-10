import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from 'src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from 'src/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { User } from 'src/types'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Heading } from 'src/components/ui/heading'
import { Input } from 'src/components/ui/input'
import { createPatchMutationHook } from 'src/api/hooks/usePatch'

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Please fill this field' }),
  lastName: z.string().min(1, { message: 'Please fill this field' }),
  phone: z.string().min(1, { message: 'Please fill this field' }),
  address: z.string().min(1, { message: 'Please fill this field' }),
  // stateId: z.string().min(1, { message: 'Please fill this field' }),
})

type ProfileData = z.infer<typeof formSchema>

type ProfileDialogProps = {
  user: User
}

export default function ProfileDialog({ user }: ProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  const useGetStates = createGetQueryHook({
    endpoint: '/states',
    responseSchema: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    queryKey: ['states'],
  })

  const useUpdateUser = (userId: string) => {
    return createPatchMutationHook({
      endpoint: `/users/update-profile`,
      requestSchema: formSchema,
      responseSchema: z.string(),
    })()
  }

  const updateUserMutation = useUpdateUser(user.id)

  const { data: states = [], isLoading: isLoadingStates } = useGetStates()

  const form = useForm<ProfileData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
      // stateId: user.stateId || '',
    },
  })
  const {
    reset,
    formState: { isDirty },
  } = form

  const onSubmit = async (data: ProfileData) => {
    try {
      setError(null)
      await updateUserMutation.mutateAsync(data)
      setStep(2)
    } catch (err) {
      console.error('Error updating user:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error: string; message: string } } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
          })
        }
      }
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep(1)
    reset()
  }

  const ProfileForm = () => {
    return (
      <>
        <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
          <Heading className="text-center" level={6}>
            Edit Profile
          </Heading>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <Alert variant="error" tone="filled">
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <div className="grid w-full grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* <FormField
                control={form.control}
                name="stateId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger className="font-light !text-neutral-400">
                          <FlexBox gap="gap-2" align="center" justify="center">
                            <SolarIconSet.Signpost iconStyle="Outline" size={20} />
                            <SelectValue placeholder="State" />
                          </FlexBox>
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingStates ? (
                            <SelectItem value="loading" disabled>
                              <Text>Loading states...</Text>
                            </SelectItem>
                          ) : (
                            states.map((state) => (
                              <SelectItem key={state.id} value={String(state.id)}>
                                {state.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
              <Button variant="outline" type="button">
                <DialogClose>
                  <Text>Back</Text>
                </DialogClose>
              </Button>
              <Button type="submit" variant="primary" disabled={!isDirty}>
                <Text>Edit Profile</Text>
              </Button>
            </div>
          </form>
        </Form>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary-400">
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Edit</Text>
          </FlexBox>
        </Button>
      </DialogTrigger>

      <DialogContent className="min-h-[410px] overflow-hidden px-8 py-4">
        <div className="py-[4rem] pb-[6rem]">
          {step === 1 && <ProfileForm />}
          {step === 2 && (
            <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
              <Heading level={6}>Completed!</Heading>
              <Text weight="light" size="base">
                Profile updated successfully!
              </Text>
              <Button variant="primary" onClick={handleClose}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
