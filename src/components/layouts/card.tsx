import Footer from './footer'

type CardProps = {
  children: React.ReactNode
  className?: string
  footer?: boolean
}

export const Card = ({ children, className = '', footer }: CardProps) => {
  return (
    <div className={`rounded-lg border bg-white p-1 shadow-md ${className}`}>
      <div className="p-5">{children}</div>
      {footer === true && <Footer />}
    </div>
  )
}
