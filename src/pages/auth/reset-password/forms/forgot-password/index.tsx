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
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Please fill this field' }),
})
type ResetData = z.infer<typeof formSchema>

export default function ForgotPassword({ handleNext }: { handleNext: () => void }) {
  const { t } = useTranslation('translation')
  const form = useForm<ResetData>({ resolver: zodResolver(formSchema) })

  const heading = 'Reset your Password'
  const subheading = "Enter your email address, and we'll send you instructions to reset your password."
  const footerContent: ReactNode = (
    <span className="text-sm">
      <span className="text-neutral-5">Remember Password? </span>
      <span>
        <Link to="/login" className="font-semibold text-neutral-6">
          Login
        </Link>
      </span>
    </span>
  )

  const onSubmit = (data: ResetData) => {
    console.log(data)
    handleNext()
  }

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto w-full max-w-[29rem]  font-inter" footer={true} footerContent={footerContent}>
          <CardHeader heading_string={heading} subheading={subheading} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormInput
                label="Email address"
                type="email"
                placeholder="johndoe@email.com"
                {...form.register('email')}
                required
              />
              <Button
                type="submit"
                // variant={form.formState.isValid ? 'primary' : 'ghost'}
                variant="primary"
                className="my-4 flex gap-2 px-3.5 py-2.5 focus:outline-none"
                disabled={!form.formState.isValid}
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
