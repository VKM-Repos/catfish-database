type InlineProps = {
  children: React.ReactNode
  gap?: string
  align?: 'start' | 'center' | 'end'
  className?: string
}

export const Inline = ({ children, gap = 'gap-4', align = 'center', className = '' }: InlineProps) => {
  return <div className={`flex items-${align} ${gap} ${className}`}>{children}</div>
}
