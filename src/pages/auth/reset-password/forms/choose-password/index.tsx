import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PageTransition from 'src/components/animations/page-transition'
import FormInput from 'src/components/form-input'
import { Card } from 'src/components/layouts/card'
import { Container } from 'src/components/layouts/container'
import { Form } from 'src/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'src/components/ui/button'
import CardHeader from 'src/components/layouts/card-header'

const passwordSchema = z
  .object({
    password: z
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordData = z.infer<typeof passwordSchema>

export default function ChoosePassword({ handleNext }: { handleNext: () => void }) {
  const { t } = useTranslation('translation')
  const form = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })

  const heading = 'Choose a new password'
  const subheading =
    'Your new password must be at least 8 characters long and include a mix of letters, numbers, and symbols.'

  const onSubmit = (data: PasswordData) => {
    console.log(data)
    handleNext()
  }

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto flex w-full max-w-[29rem] flex-col gap-6 font-inter">
          <CardHeader heading_string={heading} subheading={subheading} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormInput
                label="New password"
                type="password"
                placeholder="Enter password"
                {...form.register('password')}
                required
              />
              <FormInput
                label="Confirm new password"
                type="password"
                placeholder="Repeat password"
                {...form.register('confirmPassword')}
                required
              />
              <Button
                type="submit"
                // variant={form.formState.isValid ? 'primary' : 'ghost'}
                variant="primary"
                className="my-4 flex gap-2 focus:outline-none"
              >
                Reset password
              </Button>
            </form>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  )
}
