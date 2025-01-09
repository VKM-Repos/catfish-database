import React from 'react'
import { Header } from '../header'
import { Sidebar } from '../sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col bg-white">
      <Header />
      <div className="flex w-full" style={{ height: 'calc(100vh - 68px)' }}>
        <aside className="h-full w-full max-w-[20%] overflow-hidden py-[16px]">
          <Sidebar />
        </aside>
        <main className="w-full overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

export { DashboardLayout }
