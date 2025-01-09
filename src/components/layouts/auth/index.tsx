import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-primary-5 flex min-h-screen items-center justify-center">{children}</div>
}

export { AuthLayout }
