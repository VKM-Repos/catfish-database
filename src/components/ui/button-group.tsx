type ButtonGroupProps = {
  children: React.ReactNode
  className?: string
}

export const ButtonGroup = ({ children, className = '' }: ButtonGroupProps) => {
  return <div className={`inline-flex space-x-2 ${className}`}>{children}</div>
}
