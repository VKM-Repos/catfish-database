import { Heading } from './heading'

type PageHeaderProps = {
  title: string
  actions?: React.ReactNode
  className?: string
}

export const PageHeader = ({ title, actions, className = '' }: PageHeaderProps) => {
  return (
    <header className={`my-[2rem] flex h-16 items-center justify-between py-1 ${className}`}>
      <Heading level={5}>{title}</Heading>
      {actions && <div>{actions}</div>}
    </header>
  )
}
