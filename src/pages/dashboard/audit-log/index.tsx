import { useTranslation } from 'react-i18next'
import { Container } from '../../../components/layouts/container'

export default function AuditLog() {
  const { t } = useTranslation('translation')
  return (
    <Container>
      <p>{t('title')}</p>
    </Container>
  )
}
