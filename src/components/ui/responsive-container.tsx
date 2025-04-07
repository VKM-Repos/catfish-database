type ResponsiveContainerProps = {
  children: React.ReactNode
  className?: string
}

export const ResponsiveContainer = ({ children, className = '' }: ResponsiveContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl ${className}`}>
      {children}
    </div>
  )
}
