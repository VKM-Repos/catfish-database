import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-primary-5">{children}</div>
}

export { AuthLayout }
