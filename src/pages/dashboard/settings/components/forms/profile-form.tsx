import { Heading } from 'src/components/ui/heading'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'

export default function ProfileForm({ form, onSubmit, error, setOpen }: any) {
  const {
    formState: { isDirty },
  } = form

  return (
    <div className="py-[4rem] pb-[6rem]">
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
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={!isDirty}>
              Edit Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
