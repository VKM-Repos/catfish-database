import { cn } from 'src/lib/utils'
import { ReactNode } from 'react'

type StatusType = 'good' | 'medium' | 'critical'

interface StatusBadgeProps {
  status: StatusType
  goodText?: string
  mediumText?: string
  criticalText?: string
  goodBg?: string
  mediumBg?: string
  criticalBg?: string
  goodIcon?: ReactNode
  mediumIcon?: ReactNode
  criticalIcon?: ReactNode
  className?: string
}

export function SuperAdminStatusBadge({
  status,
  goodText = 'Good',
  mediumText = 'Medium',
  criticalText = 'Critical',
  goodBg,
  mediumBg,
  criticalBg,
  goodIcon,
  mediumIcon,
  criticalIcon,
  className,
}: StatusBadgeProps) {
  const defaultGoodBg = 'border-success-400 bg-success-100 text-success-500'
  const defaultMediumBg = 'border-warning-400 bg-warning-100 text-warning-500'
  const defaultCriticalBg = 'border-error-400 bg-error-100 text-error-500'

  const statusConfig = {
    good: {
      text: goodText,
      bg: goodBg || defaultGoodBg,
      icon: goodIcon || <div className="h-2 w-2 rounded-full bg-success-400" />,
    },
    medium: {
      text: mediumText,
      bg: mediumBg || defaultMediumBg,
      icon: mediumIcon || <div className="h-2 w-2 rounded-full bg-warning-400" />,
    },
    critical: {
      text: criticalText,
      bg: criticalBg || defaultCriticalBg,
      icon: criticalIcon || <div className="h-2 w-2 rounded-full bg-error-400" />,
    },
  }

  const currentStatus = statusConfig[status]

  return (
    <div
      className={cn(
        'flex max-w-fit items-center gap-2 rounded-[4rem] border px-2 py-1 text-sm capitalize',
        currentStatus.bg,
        className,
      )}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </div>
  )
}
