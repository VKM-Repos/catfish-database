import { Heading } from 'src/components/ui/heading'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Loader } from 'src/components/ui/loader'
import { Text } from 'src/components/ui/text'
import FormValidationErrorAlert from '../form-alert-error'

export default function ProfileForm({ form, onSubmit, error, setOpen, loading }: any) {
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
          {error && <FormValidationErrorAlert error={error} />}
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

          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={!isDirty || loading} className="flex items-center gap-2">
              {loading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text color="text-inherit" variant="body">
                    Updating
                  </Text>
                </>
              ) : (
                <>
                  <Text color="text-inherit" variant="body">
                    Edit profile
                  </Text>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
