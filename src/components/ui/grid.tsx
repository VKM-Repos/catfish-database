type GridProps = {
  children: React.ReactNode
  cols?: number
  gap?: string
  className?: string
  style?: React.CSSProperties
}

export const Grid = ({ children, cols = 3, gap = 'gap-4', className = '', style }: GridProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols} ${gap} ${className}`} style={style}>
      {children}
    </div>
  )
}
