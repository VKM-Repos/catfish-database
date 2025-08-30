import { cn } from 'src/lib/utils'
import { ReactNode } from 'react'

interface StatusBadgeProps {
  status: boolean
  activeText?: string
  inactiveText?: string
  activeConfig?: {
    textColor: string
    borderColor: string
    backgroundColor: string
    dotColor: string
  }
  inactiveConfig?: {
    textColor: string
    borderColor: string
    backgroundColor: string
    dotColor: string
  }
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatusBadge({
  status,
  activeText = 'Active',
  inactiveText = 'Inactive',
  activeConfig = {
    textColor: 'text-success-500',
    borderColor: 'border-success-400',
    backgroundColor: 'bg-success-100',
    dotColor: 'bg-success-400',
  },
  inactiveConfig = {
    textColor: 'text-neutral-400',
    borderColor: 'border-neutral-400',
    backgroundColor: 'bg-neutral-100',
    dotColor: 'bg-neutral-400',
  },
  activeIcon,
  inactiveIcon,
  size = 'md',
  className,
}: StatusBadgeProps) {
  console.log(status, '??? stat')
  const config = status ? activeConfig : inactiveConfig
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2 py-1 text-sm gap-2',
    lg: 'px-3 py-1.5 text-base gap-2',
  }

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }

  const defaultIcon = <div className={cn('rounded-full', config.dotColor, dotSizes[size])} />

  const icon = !status ? activeIcon ?? defaultIcon : inactiveIcon ?? defaultIcon

  return (
    <div
      className={cn(
        'flex max-w-fit items-center rounded-full border font-medium capitalize',
        config.textColor,
        config.borderColor,
        config.backgroundColor,
        sizeClasses[size],
        className,
      )}
    >
      {icon}
      {status ? activeText : inactiveText}
    </div>
  )
}
