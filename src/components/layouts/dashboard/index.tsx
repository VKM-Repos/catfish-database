import React from 'react'
import { Header } from '../header'
import { Sidebar } from '../sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="h-full w-full max-w-[20%] overflow-y-auto border-r">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

export { DashboardLayout }
