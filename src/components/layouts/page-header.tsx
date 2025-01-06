import { Heading } from './heading'

type PageHeaderProps = {
  title: string
  actions?: React.ReactNode
  className?: string
}

export const PageHeader = ({ title, actions, className = '' }: PageHeaderProps) => {
  return (
    <header className={`flex items-center justify-between py-4 ${className}`}>
      <Heading level="h2">{title}</Heading>
      {actions && <div>{actions}</div>}
    </header>
  )
}
