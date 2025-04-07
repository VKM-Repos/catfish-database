import { cn } from 'src/lib/utils'

type LogoProps = React.HTMLAttributes<HTMLDivElement>

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn('flex items-center', className)} {...props}>
      <img src="/fish-logo.webp" alt="Catfish DB Logo" className="h-full w-full" />
    </div>
  )
}
