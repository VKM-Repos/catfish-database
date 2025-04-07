import { Outlet } from 'react-router-dom'
import { Page } from 'src/components/ui/page'
import { Header } from 'src/components/layouts/dashboard/header'

export function DashboardNoSidebarLayout() {
  return (
    <Page>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </Page>
  )
}
