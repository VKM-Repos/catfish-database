type DividerProps = {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Divider = ({ orientation = 'horizontal', className = '' }: DividerProps) => {
  return (
    <div
      className={`${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'} bg-neutral-200 ${className}`}
      style={orientation === 'vertical' ? { height: '70%' } : {}}
    />
  )
}
