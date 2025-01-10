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
    navigate('/')
  }

  return (
    <PageTransition>
      <Container className="w-fit">
        <Card className="mx-auto flex w-full min-w-[30rem] max-w-screen-xl flex-col gap-6 font-inter" footer={true}>
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
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-xs text-neutral-500">
                    Remember me
                  </label>
                </div>
                <Link to="/forget-password" className="text-sm text-primary-500 underline">
                  Forgot password
                </Link>
              </div>
              <Button
                type="submit"
                variant={form.formState.isValid ? 'primary' : 'ghost'}
                className="my-4 flex gap-2 !px-4 !py-4 focus:outline-none"
                disabled={!form.formState.isValid}
              >
                Log in
                <span>
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.7246 4.55803C11.9687 4.31395 12.3644 4.31395 12.6085 4.55803L17.6085 9.55803C17.8526 9.80211 17.8526 10.1978 17.6085 10.4419L12.6085 15.4419C12.3644 15.686 11.9687 15.686 11.7246 15.4419C11.4806 15.1978 11.4806 14.8021 11.7246 14.558L15.6577 10.625H3.83325C3.48807 10.625 3.20825 10.3451 3.20825 9.99997C3.20825 9.65479 3.48807 9.37497 3.83325 9.37497H15.6577L11.7246 5.44191C11.4806 5.19783 11.4806 4.80211 11.7246 4.55803Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </Button>
            </form>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  )
}
