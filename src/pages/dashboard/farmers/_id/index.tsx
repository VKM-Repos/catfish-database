import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import { FlexBox } from 'src/components/ui/flexbox'
import { Spacer } from 'src/components/ui/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import FarmDetailOverview from './tabs/farm-detail-overview'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { StatusBadge } from 'src/components/global/status-badge'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { farmerResponseSchema } from 'src/schemas'
import { paths } from 'src/routes'
import { LoadingScreen } from 'src/components/global/loading-screen'
import Ponds from './tabs/ponds'

const useGetFarmer = createGetQueryHook<typeof farmerResponseSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: farmerResponseSchema,
  queryKey: ['farmer-details'],
})

export default function FarmDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const { data: farmer, isLoading } = useGetFarmer({ route: { id: id! } })

  const title = `${farmer?.firstName} ${farmer?.lastName}'s Farm`

  const farmStatus = farmer?.accountNonLocked === true ? true : false

  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }

  const handleGoBack = () => {
    navigate(paths.dashboard.farmers.root)
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
                <Text className="text-xs text-[#651391]">Farmers</Text>
              </button>
              <SolarIconSet.AltArrowRight color="#651391" size={16} />
              <Text className="text-xs text-neutral-600">Farmer details</Text>
            </FlexBox>
            <Heading className="!text-[1.875rem] font-semibold">{title}</Heading>
          </FlexBox>
          <StatusBadge
            status={farmStatus}
            activeText="Active"
            inactiveText="Deactivated"
            activeIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />}
            inactiveIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />}
          />
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
                  <TabsTrigger value="ponds" className="data-[state=active]:font-bold">
                    Ponds
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview" className="w-full">
                <FarmDetailOverview farmer={farmer!} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="ponds" className="w-full">
                <Ponds />
              </TabsContent>
            </Tabs>
          </FlexBox>
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
