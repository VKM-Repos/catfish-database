type SpacerProps = {
  size?: string
  className?: string
}

export const Spacer = ({ size = 'lg:h-4 h-[60px]', className = '' }: SpacerProps) => {
  return <div className={`${size} ${className}`} />
}
