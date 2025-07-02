import { cn } from 'src/lib/utils'
import { ReactNode } from 'react'
import { UserRole } from 'src/types'
import { ROLE_CONFIG } from 'src/lib/constants'

interface RoleBadgeProps {
  role: UserRole
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'subtle'
  showIcon?: boolean
  className?: string
  customIcon?: ReactNode
}

export function RoleBadge({
  role,
  size = 'md',
  variant = 'default',
  showIcon = false,
  className,
  customIcon,
}: RoleBadgeProps) {
  const config = ROLE_CONFIG[role]

  if (!config) {
    // Fallback for unknown roles
    return (
      <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-sm text-gray-600">
        <div className="h-2 w-2 rounded-full bg-gray-400" />
        Unknown Role
      </div>
    )
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return `border-2 ${config.borderColor} bg-transparent ${config.textColor}`
      case 'subtle':
        return `border ${config.borderColor} ${config.backgroundColor} ${config.textColor} opacity-80`
      default:
        return `border ${config.borderColor} ${config.backgroundColor} ${config.textColor}`
    }
  }

  const icon = customIcon || <div className={cn('rounded-full', config.dotColor, dotSizes[size])} />

  return (
    <div
      className={cn(
        'flex max-w-fit items-center rounded-full font-medium capitalize',
        sizeClasses[size],
        getVariantClasses(),
        className,
      )}
    >
      {showIcon && icon}
      {config.label}
    </div>
  )
}
