type BadgeProps = {
  text: string
  color?: string
  background?: string
  className?: string
}

export const Badge = ({ text, background = 'bg-primary', color = 'text-white', className = '' }: BadgeProps) => {
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${color} ${background} ${className}`}>
      {text}
    </span>
  )
}
