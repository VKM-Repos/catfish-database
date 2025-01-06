type OverlayProps = {
  children?: React.ReactNode
  className?: string
}

export const Overlay = ({ children, className = '' }: OverlayProps) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}>
      {children}
    </div>
  )
}
