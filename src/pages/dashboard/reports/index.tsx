import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { FlexBox } from 'src/components/ui/flexbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import FeedingReportsTable from './tabs/reports-table/feeding-report'
import SamplingReportsTable from './tabs/reports-table/sampling-history'
import HarvestReportsTable from './tabs/reports-table/harvest-records'

export default function ClusterManagersPage() {
  const title = 'Reports'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'feeding-reports'
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
              className="flex w-full flex-col items-start gap-8"
              onValueChange={handleTabChange}
            >
              <div className="w-full border-b border-b-neutral-200 p-0">
                <TabsList className="text-sm font-semibold">
                  <TabsTrigger value="feeding-reports" className="data-[state=active]:font-bold">
                    Feeding reports
                  </TabsTrigger>
                  <TabsTrigger value="sampling-report" className="data-[state=active]:font-bold">
                    Sampling report
                  </TabsTrigger>
                  <TabsTrigger value="harvest-reports" className="data-[state=active]:font-bold">
                    Harvest reports
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="feeding-reports" className="w-full">
                <FeedingReportsTable />
              </TabsContent>
              <TabsContent value="sampling-report" className="w-full">
                <SamplingReportsTable />
              </TabsContent>
              <TabsContent value="harvest-reports" className="w-full">
                <HarvestReportsTable />
              </TabsContent>
            </Tabs>
          </FlexBox>
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
