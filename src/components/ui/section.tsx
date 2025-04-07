type SectionProps = {
  children: React.ReactNode
  className?: string
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return <section className={`py-8 md:py-12 ${className}`}>{children}</section>
}
