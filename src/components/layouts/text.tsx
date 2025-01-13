type TextProps = {
  variant?: 'body' | 'caption' | 'label' | 'subtitle'
  children: React.ReactNode
  className?: string
  size?: string
}

export const Text = ({ variant = 'body', children, className = '' }: TextProps) => {
  let baseStyle = ''

  switch (variant) {
    case 'body':
      baseStyle = 'text-sm leading-relaxed'
      break
    case 'caption':
      baseStyle = 'text-sm text-neutral-500'
      break
    case 'label':
      baseStyle = 'text-sm font-normal'
      break
    case 'subtitle':
      baseStyle = 'text-lg font-medium'
      break
  }

  return <p className={`${baseStyle} ${className}`}>{children}</p>
}
