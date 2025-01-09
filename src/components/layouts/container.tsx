type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  return <div className={`mx-auto max-w-screen-xl px-2 md:px-4 ${className}`}>{children}</div>
}
