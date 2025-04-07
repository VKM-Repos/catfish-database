import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { Heading } from 'src/components/ui/heading'

export default function ResetComplete() {
  const { t } = useTranslation('translation')
  const navigate = useNavigate()

  return (
    <>
      <div className="mt-[2rem] flex flex-col items-center justify-center gap-4">
        <Heading level={6} weight="normal">
          Password reset complete!
        </Heading>
        <Text weight="light" size="base" align="center">
          You have successfully reset your password, please login to your account.
        </Text>
      </div>
      <Button
        onClick={() => navigate('/auth/login')}
        variant="primary"
        className="my-4 flex w-full gap-2 focus:outline-none"
      >
        <Text weight="light" size="base" align="center">
          Login
        </Text>
      </Button>
    </>
  )
}
