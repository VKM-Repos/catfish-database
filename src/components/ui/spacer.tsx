type SpacerProps = {
  size?: string
  className?: string
}

export const Spacer = ({ size = 'h-4', className = '' }: SpacerProps) => {
  return <div className={`${size} ${className}`} />
}
