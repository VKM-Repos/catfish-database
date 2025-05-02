import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import { FlexBox } from 'src/components/ui/flexbox'
import { Spacer } from 'src/components/ui/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import PondDetailOverview from './tabs/pond-detail-overview'
import FeedingSampling from './tabs/feeding-sampling-tab'
import StockingHistory from './tabs/stocking-history-tab'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { StatusBadge } from 'src/components/global/status-badge'
import MaintenanceLogs from './tabs/maintenance-logs'
import * as SolarIconSet from 'solar-icon-set'

export default function PondsDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }

  const title = 'Sunny pond details'
  const pondStatus = true

  return (
    <div className="relative pb-[5rem]">
      <PageTransition>
        <FlexBox
          justify="between"
          align="center"
          className="sticky mb-[2rem] mt-4 w-full px-6 py-[.625rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]"
        >
          <FlexBox direction="col" gap="gap-1">
            <Heading className="!text-[1.875rem] font-semibold">Sunny pond details</Heading>
            <Text className="text-sm text-neutral-700">#Pond1245678</Text>
          </FlexBox>
          <StatusBadge status={pondStatus} activeIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />} />
        </FlexBox>
        <Spacer />
        <Container className="!px-12">
          <FlexBox direction="col" justify="center" align="start" gap="gap-4" className="w-full cursor-default">
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              className="flex w-full flex-col items-start gap-8"
              onValueChange={handleTabChange}
            >
              <div className="w-full border-b border-b-neutral-200 p-0">
                <TabsList className="text-sm font-semibold">
                  <TabsTrigger value="overview" className="data-[state=active]:font-bold">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="stocking-history" className="data-[state=active]:font-bold">
                    Stocking history
                  </TabsTrigger>
                  <TabsTrigger value="feeding-sampling" className="data-[state=active]:font-bold">
                    Feeding, sampling & harvest logs
                  </TabsTrigger>
                  <TabsTrigger value="maintenance-logs" className="data-[state=active]:font-bold">
                    Maintenance logs
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview" className="w-full">
                <PondDetailOverview />
              </TabsContent>
              <TabsContent value="stocking-history" className="w-full">
                <StockingHistory />
              </TabsContent>
              <TabsContent value="feeding-sampling" className="w-full">
                <FeedingSampling />
              </TabsContent>
              <TabsContent value="maintenance-logs" className="w-full">
                <MaintenanceLogs />
              </TabsContent>
            </Tabs>
          </FlexBox>
        </Container>
      </PageTransition>
    </div>
  )
}
