type TableWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const TableWrapper = ({ children, className = '' }: TableWrapperProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-full">{children}</div>
    </div>
  )
}
