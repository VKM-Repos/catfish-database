type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  return <div className={`mx-auto lg:max-w-screen-xl lg:px-4  ${className}`}>{children}</div>
}
