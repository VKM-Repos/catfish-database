import { cn } from 'src/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type HeadingProps = {
  level?: HeadingLevel
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
}

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

// Map heading levels to HTML tags
const levelToTag = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const

// Map heading levels to font sizes
const levelToSize = {
  1: 'text-[48px]',
  2: 'text-[40px]',
  3: 'text-[32px]',
  4: 'text-[28px]',
  5: 'text-[24px]',
  6: 'text-[20px]',
} as const

export const Heading = ({
  level = 1,
  children,
  className = '',
  size,
  weight = 'medium',
  color = 'text-neutral-900',
}: HeadingProps) => {
  const Tag = levelToTag[level]
  const defaultSize = size ? sizeMap[size] : levelToSize[level]

  return <Tag className={cn(weightMap[weight], defaultSize, color, className)}>{children}</Tag>
}
