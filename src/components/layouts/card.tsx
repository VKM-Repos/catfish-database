type CardProps = {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return <div className={`rounded-lg border bg-white p-6 shadow-md ${className}`}>{children}</div>
}
