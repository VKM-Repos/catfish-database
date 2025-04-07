type GridProps = {
  children: React.ReactNode
  cols?: number
  gap?: string
  className?: string
}

export const Grid = ({ children, cols = 3, gap = 'gap-4', className = '' }: GridProps) => {
  return <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols} ${gap} ${className}`}>{children}</div>
}
