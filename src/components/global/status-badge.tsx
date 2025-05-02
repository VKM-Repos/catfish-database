import { cn } from 'src/lib/utils'
import { ReactNode } from 'react'

interface StatusBadgeProps {
  status: boolean
  activeText?: string
  inactiveText?: string
  activeBg?: string
  inactiveBg?: string
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  className?: string
}

export function StatusBadge({
  status,
  activeText = 'Active',
  inactiveText = 'Deactivated',
  activeBg,
  inactiveBg,
  activeIcon,
  inactiveIcon,
  className,
}: StatusBadgeProps) {
  const defaultActiveBg = 'border-success-400 bg-success-100 text-success-500'
  const defaultInactiveBg = 'bg-neutral-400 border-neutral-400 bg-neutral-100 text-neutral-400'

  const badgeBg = status ? activeBg || defaultActiveBg : inactiveBg || defaultInactiveBg

  const defaultDot = <div className={cn('h-2 w-2 rounded-full', status ? 'bg-success-400' : 'bg-[#FF0000]')} />

  const icon = status ? activeIcon ?? defaultDot : inactiveIcon ?? defaultDot

  return (
    <div
      className={cn(
        'flex max-w-fit items-center gap-2 rounded-[4rem] border px-2 py-1 text-sm capitalize',
        badgeBg,
        className,
      )}
    >
      {icon}
      {status ? activeText : inactiveText}
    </div>
  )
}
