type CenterProps = {
  children: React.ReactNode
  className?: string
}

export const Center = ({ children, className = '' }: CenterProps) => {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>
}
