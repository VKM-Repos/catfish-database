type StackProps = {
  children: React.ReactNode
  gap?: string // e.g., gap-4, gap-6
  className?: string
}

export const Stack = ({ children, gap = 'gap-4', className = '' }: StackProps) => {
  return <div className={`flex flex-col ${gap} ${className}`}>{children}</div>
}
