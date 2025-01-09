type HeadingProps = {
  level?: 'h1' | 'h2' | 'h3' | 'h4'
  children: React.ReactNode
  className?: string
}

export const Heading = ({ level = 'h1', children, className = '' }: HeadingProps) => {
  const Tag = level

  return (
    <Tag
      className={`font-medium text-neutral-600 text-${level === 'h1' ? '3xl' : '2xl'} ${
        level === 'h1' ? 'mb-6' : 'mb-4'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
