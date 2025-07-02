import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { FlexBox } from 'src/components/ui/flexbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import { ScrollArea } from 'src/components/ui/scroll-area'
import ConfigurationTable from './tabs/configuration'
import NotificationTable from './tabs/notification'

export default function ConfigPage() {
  const title = 'Configuration'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'configuration'
  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }
  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader
            title={title}
            actions={null}
            subtitle="Manage system-wide settings and rules for the Catfish Farm Management System"
          />
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
                  <TabsTrigger value="configuration" className="data-[state=active]:font-semibold">
                    Configuration
                  </TabsTrigger>
                  <TabsTrigger value="notification" className="data-[state=active]:font-semibold">
                    Notification
                  </TabsTrigger>
                </TabsList>
              </div>
              <ScrollArea className="h-[calc(100vh-240px)] w-full">
                <TabsContent value="configuration" className="w-full">
                  <ConfigurationTable />
                </TabsContent>
                <TabsContent value="notification" className="w-full">
                  <NotificationTable />
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
