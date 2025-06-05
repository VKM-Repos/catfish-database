import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { FlexBox } from 'src/components/ui/flexbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import FeedInventoryTable from './tabs/inventory/feed-inventory'
import SalesRecordsTable from './tabs/inventory/sales-records'
import MaintenanceExpensesTable from './tabs/inventory/maintenance-expenses'
import { ScrollArea } from 'src/components/ui/scroll-area'

export default function InventoryPage() {
  const title = 'Inventory'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'feed-inventory'
  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }
  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={null} />
          <Spacer />
          <FlexBox direction="col" justify="center" align="start" gap="gap-4" className="w-full cursor-default">
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              className="flex w-full flex-col items-start gap-1"
              onValueChange={handleTabChange}
            >
              <div className="w-full border-b border-b-neutral-200 p-0">
                <TabsList className="text-sm font-semibold">
                  <TabsTrigger value="feed-inventory" className="data-[state=active]:font-semibold">
                    Feed Inventory
                  </TabsTrigger>
                  <TabsTrigger value="maintenance-expenses" className="data-[state=active]:font-semibold">
                    Maintenance & Expenses
                  </TabsTrigger>
                  <TabsTrigger value="sales-records" className="data-[state=active]:font-semibold">
                    Sales records
                  </TabsTrigger>
                </TabsList>
              </div>
              <ScrollArea className="h-[calc(100vh-240px)] w-full">
                <TabsContent value="feed-inventory" className="w-full">
                  <FeedInventoryTable />
                </TabsContent>
                <TabsContent value="maintenance-expenses" className="w-full">
                  <MaintenanceExpensesTable />
                </TabsContent>
                <TabsContent value="sales-records" className="w-full">
                  <SalesRecordsTable />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </FlexBox>
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
