type FlexBoxProps = {
  children: React.ReactNode
  direction?: 'row' | 'col'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  align?: 'start' | 'center' | 'end' | 'stretch'
  gap?: string
  className?: string
}

export const FlexBox = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'gap-4',
  className = '',
}: FlexBoxProps) => {
  return (
    <div className={`flex flex-${direction} justify-${justify} items-${align} ${gap} ${className}`}>{children}</div>
  )
}
