import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from 'src/components/form-input'
import { FlexBox } from 'src/components/layouts/flexbox'
import { Text } from 'src/components/layouts/text'
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Form } from 'src/components/ui/form'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'

const formSchema = z
  .object({
    old_password: z.string(),
    new_password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Password must contain at least one number',
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>_+\-=/[\]\\/~`']/.test(value), {
        message: 'Password must contain at least one symbol',
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type PasswordData = z.infer<typeof formSchema>

export default function PasswordDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<PasswordData>({ resolver: zodResolver(formSchema) })
  const {
    formState: { isDirty },
  } = form

  const onSubmit = (data: PasswordData) => {
    console.log(data)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-primary-400">
            <Text className="text-primary-400">Change Password</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="cursor-default rounded-lg bg-white shadow-dialog">
          <FlexBox direction="col" justify="center" gap="gap-6">
            <DialogHeader className="w-full border-[0.5px] border-b-neutral-300 px-6 py-3">
              <DialogTitle className="text-center text-xl font-bold">Change Password</DialogTitle>
            </DialogHeader>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FlexBox direction="col" gap="gap-6" justify="center" className="w-full p-6">
                  <div className="w-full">
                    <FormInput
                      label="Old password"
                      type="password"
                      placeholder="Enter old password"
                      className="!border-neutral-200"
                      {...form.register('old_password')}
                      disabled
                    />
                  </div>
                  <div className="w-full">
                    <FormInput
                      label="New password"
                      type="password"
                      placeholder="Enter new password"
                      className="!border-neutral-200"
                      {...form.register('new_password')}
                    />
                  </div>
                  <div className="w-full">
                    <FormInput
                      label="Confirm new password"
                      type="password"
                      placeholder="Repeat new password"
                      {...form.register('confirm_password')}
                      className="!border-neutral-200"
                    />
                  </div>
                </FlexBox>
                <footer
                  className={`mx-auto w-full rounded-sm !bg-neutral-50 px-0 py-0 text-center text-sm text-neutral-400`}
                >
                  <FlexBox justify="between" align="center" className="px-6 py-3">
                    <Button variant="outline">
                      <DialogClose>
                        <Text>Cancel</Text>
                      </DialogClose>
                    </Button>
                    <Button type="submit" variant="primary" disabled={!isDirty}>
                      <Text>Update Password</Text>
                    </Button>
                  </FlexBox>
                </footer>
              </form>
            </Form>
          </FlexBox>
        </DialogContent>
      </Dialog>
    </>
  )
}
