type FooterProps = {
  className?: string
  footerContent?: React.ReactNode
}

export default function Footer({ className = '', footerContent }: FooterProps) {
  return (
    <footer
      className={`mx-auto w-full rounded-sm bg-neutral-1 px-8 py-4 text-center text-sm text-neutral-4 ${className}`}
    >
      {footerContent || 'Copyright @ FAO 2025'}
    </footer>
  )
}
