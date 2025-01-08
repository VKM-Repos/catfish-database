import Footer from './footer'

type CardProps = {
  children: React.ReactNode
  className?: string
  footer?: boolean
  footerContent?: React.ReactNode
}

export const Card = ({ children, className = '', footer, footerContent }: CardProps) => {
  return (
    <div className={`rounded-lg border bg-white p-1 shadow-md ${className}`}>
      <div className="p-5">{children}</div>
      {footer === true && <Footer footerContent={footerContent} />}
    </div>
  )
}
