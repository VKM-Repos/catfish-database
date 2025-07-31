import { Outlet } from 'react-router-dom'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import { cn } from 'src/lib/utils'
import { Page } from 'src/components/ui/page'

export function DashboardLayout() {
  return (
    <Page>
      <div className="bg-background relative flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 bg-white">
          <aside className="fixed inset-y-0 left-0 top-[4.75rem] z-30 hidden w-[270px] px-3 lg:block">
            <ScrollArea className="h-[calc(100dvh-4rem)]">
              <Sidebar />
            </ScrollArea>
          </aside>

          <main className={cn('lg:flex-1', 'w-full', 'lg:pl-64')}>
            <div className="mx-5 ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </Page>
  )
}
