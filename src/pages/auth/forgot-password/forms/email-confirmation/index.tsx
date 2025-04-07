import { useTranslation } from 'react-i18next'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'

export default function Confirmation() {
  const { t } = useTranslation('translation')

  return (
    <>
      <div className="mt-[2rem] flex flex-col items-center justify-center gap-4">
        <Heading level={6} weight="normal">
          Email Sent!
        </Heading>
        <Text weight="light" size="base" align="center">
          Check your inbox for instructions on how to reset your password.
        </Text>
      </div>
    </>
  )
}
