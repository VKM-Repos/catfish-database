import { Heading } from './heading'
import { Text } from 'src/components/ui/text'

type PageHeaderProps = {
  title: string
  actions?: React.ReactNode
  className?: string
  subtitle?: string
}

export const PageHeader = ({ title, actions, className = '', subtitle = '' }: PageHeaderProps) => {
  return (
    <header className={`my-[2rem] flex h-16 items-center justify-between py-1 ${className}`}>
      <div>
        <Heading level={5}>{title}</Heading>
        {subtitle && <Text>{subtitle}</Text>}
      </div>
      {actions && <div>{actions}</div>}
    </header>
  )
}
