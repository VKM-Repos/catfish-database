type AspectRatioProps = {
  ratio: string
  children: React.ReactNode
  className?: string
}

export const AspectRatio = ({ ratio, children, className = '' }: AspectRatioProps) => {
  return (
    <div className={`relative ${className}`} style={{ paddingBottom: `calc(100% / (${ratio}))` }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
