type FooterProps = {
  className?: string
  footerContent?: React.ReactNode
}

export default function Footer({ className = '', footerContent }: FooterProps) {
  return (
    <footer
      className={`mx-auto w-full rounded-sm bg-neutral-100 px-8 py-4 text-center text-sm text-neutral-400 ${className}`}
    >
      {footerContent || `Copyright @ FAO ${new Date().getFullYear()}`}
    </footer>
  )
}
