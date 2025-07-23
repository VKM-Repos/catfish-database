import { cn } from 'src/lib/utils'

type LogoProps = React.ImgHTMLAttributes<HTMLImageElement>

export function PartnersLogo({ className, ...props }: LogoProps) {
  return (
    <img src="/assets/images/Partners-logos.svg" alt="Logo" className={cn('h-10 w-[263px]', className)} {...props} />
  )
}
