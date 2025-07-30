import { cn } from 'src/lib/utils'
import { Heading } from '../ui/heading'

type ChartHeaderProps = {
  title: string
  action?: React.ReactNode
  className?: string
}

export const ChartHeader = ({ title, action, className }: ChartHeaderProps) => (
  <div className={cn('flex w-full items-center justify-between pb-4', className)}>
    <Heading level={6} weight="medium" className="w-full whitespace-nowrap text-lg">
      {title}
    </Heading>
    {action && <div className="flex w-full items-center justify-end gap-2">{action}</div>}
  </div>
)
