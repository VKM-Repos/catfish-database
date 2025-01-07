import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PageTransition from 'src/components/animations/page-transition'
import FormInput from 'src/components/form-input'
import { Card } from 'src/components/layouts/card'
import { Container } from 'src/components/layouts/container'
import { Heading } from 'src/components/layouts/heading'
import { Form } from 'src/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'src/components/ui/button'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Please fill this field' }),
  password: z.string().min(1, { message: 'Please fill this field' }),
})
type LoginData = z.infer<typeof formSchema>

export default function Login() {
  const { t } = useTranslation('translation')
  const form = useForm<LoginData>({ resolver: zodResolver(formSchema) })

  const onSubmit = (data: LoginData) => {
    console.log(data)
  }

  return (
    <PageTransition>
      <Container>
        <Card className="mx-auto w-full max-w-[30rem] font-inter">
          <div className="mx-auto flex flex-col items-center gap-6">
            <div className="mx-auto flex flex-col items-center gap-5">
              <img src="./src/assets/icons/favicon.svg" alt="Organisation logo" />
              <Heading className="text-2xl font-bold text-primary-4">F.A.O</Heading>
            </div>
            <Heading className="text-xl font-medium text-black/80">Log in to access your account</Heading>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormInput
                label="Email address"
                type="email"
                placeholder="johndoe@email.com"
                {...form.register('email')}
                required
              />
              <FormInput
                label="Password"
                type="password"
                placeholder="********"
                {...form.register('password')}
                required
              />
              <Button
                type="submit"
                variant={form.formState.isValid ? 'primary' : 'ghost'}
                className="my-4 focus:outline-none"
                disabled={!form.formState.isValid}
              >
                Log in
              </Button>
            </form>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  )
}
