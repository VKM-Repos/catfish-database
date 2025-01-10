import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-500 bg-auth-background">{children}</div>
  )
}

export { AuthLayout }
