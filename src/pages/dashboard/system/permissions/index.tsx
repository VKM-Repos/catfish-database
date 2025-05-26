import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { Spacer } from 'src/components/ui/spacer'
import { Text } from 'src/components/ui/text'
import { Heading } from 'src/components/ui/heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import FarmerPermissions from './components/tabs/farmer'
import AdminPermissions from './components/tabs/admin'
import ClusterManagerPermissions from './components/tabs/cluster-manager'

export default function PermissionsPage() {
  const title = 'Roles & Permissions'
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'admin'

  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }

  return (
    <div className="relative">
      <PageTransition>
        <Container className="my-6 !px-12">
          <Heading level={5} className="pt-4 font-semibold">
            {title}
          </Heading>
          <Text size="base" weight="light">
            Define user roles and assign permissions to control access to various features of the system.
          </Text>
          <Spacer />
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            className="my-6 flex w-full flex-col items-start gap-8"
            onValueChange={handleTabChange}
          >
            <div className="w-full border-b border-b-neutral-200 p-0">
              <TabsList className="text-sm font-semibold">
                <TabsTrigger value="admin" className="data-[state=active]:font-bold">
                  Admin
                </TabsTrigger>
                <TabsTrigger value="cluster-manager" className="data-[state=active]:font-bold">
                  Cluster Manager
                </TabsTrigger>
                <TabsTrigger value="farmer" className="data-[state=active]:font-bold">
                  Farmer
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="admin" className="w-full">
              <AdminPermissions />
            </TabsContent>
            <TabsContent value="cluster-manager" className="w-full">
              <ClusterManagerPermissions />
            </TabsContent>
            <TabsContent value="farmer" className="w-full">
              <FarmerPermissions />
            </TabsContent>
          </Tabs>
        </Container>
      </PageTransition>
    </div>
  )
}
