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
import { Checkbox } from 'src/components/ui/checkbox'
import { Link, useNavigate } from 'react-router-dom'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Please fill this field' }),
  password: z.string().min(1, { message: 'Please fill this field' }),
})
type LoginData = z.infer<typeof formSchema>

export default function Login() {
  const { t } = useTranslation('translation')
  const form = useForm<LoginData>({ resolver: zodResolver(formSchema) })
  const navigate = useNavigate()

  const onSubmit = (data: LoginData) => {
    console.log(data)
    navigate('/dashboard')
  }

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto w-full min-w-[30rem] max-w-screen-xl font-inter" footer={true}>
          <CardHeader heading_string="Log in to access your account" />
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
                className="my-4 flex gap-2 px-3.5 py-2.5 focus:outline-none"
                disabled={!form.formState.isValid}
              >
                Log in
                <span>
                  <img src="src/assets/icons/arrow-right.svg" />
                </span>
              </Button>
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-xs text-neutral-5">
                    Remember me
                  </label>
                </div>
                <Link to="/reset-password" className="text-sm text-primary-5 underline">
                  Forgot password
                </Link>
              </div>
            </form>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  )
}
