import { cn } from 'src/lib/utils'

type TextVariant = 'body' | 'subtitle' | 'label' | 'caption'

type TextProps = {
  variant?: TextVariant
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
}

const variantMap = {
  body: 'font-meduim',
  subtitle: 'font-medium',
  label: 'font-medium',
  caption: 'font-normal',
}

const sizeMap = {
  xs: 'text-[10px]',
  sm: 'text-[12px]',
  base: 'text-[14px]',
  lg: 'text-[16px]',
  xl: 'text-[20px]',
  '2xl': 'text-[24px]',
}

const weightMap = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const Text = ({
  variant = 'body',
  children,
  className = '',
  size,
  weight,
  color = 'text-inherit',
  align = 'left',
  truncate = false,
}: TextProps) => {
  return (
    <p
      className={cn(
        variantMap[variant],
        size && sizeMap[size],
        weight && weightMap[weight],
        alignMap[align],
        truncate && 'truncate',
        color,
        className,
      )}
    >
      {children}
    </p>
  )
}
