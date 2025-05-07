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
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { pondResponseSchema } from 'src/schemas'
import { paths } from 'src/routes'
import { LoadingScreen } from 'src/components/global/loading-screen'

const useGetPond = createGetQueryHook<typeof pondResponseSchema, { id: string }>({
  endpoint: '/ponds/:id',
  responseSchema: pondResponseSchema,
  queryKey: ['pond-details-for-farmer'],
})

export default function PondsDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const { data: pond, isLoading } = useGetPond({ route: { id: id! } })

  const title = pond?.name
  const pondId = `#Pond${pond?.id}`
  const pondStatus = pond?.status === 'Active' ? true : false

  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }

  const handleGoBack = () => {
    navigate(paths.dashboard.ponds.root)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="relative pb-[5rem]">
      <PageTransition>
        <FlexBox
          justify="between"
          align="center"
          className="sticky mb-[2rem] mt-4 w-full px-6 py-[.625rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]"
        >
          <FlexBox direction="col" gap="gap-1">
            <FlexBox gap="gap-2" align="center">
              <button onClick={handleGoBack} className="cursor-pointer">
                <Text className="text-xs text-[#651391]">Ponds</Text>
              </button>
              <SolarIconSet.AltArrowRight color="#651391" size={16} />
              <Text className="text-xs text-neutral-600">Pond details</Text>
            </FlexBox>
            <Heading className="!text-[1.875rem] font-semibold">{title}</Heading>
            <Text className="text-sm text-neutral-700">{pondId}</Text>
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
