import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import AccountTab from './components/tabs/account-settings-tab'
import { FlexBox } from 'src/components/ui/flexbox'
import TemplateTab from './components/tabs/template-settings-tab'
import SystemPasswordTab from './components/tabs/system-password-settings-tab'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'

export default function Settings() {
  const title = 'Settings'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get user from auth store and define if user is SUPER_ADMIN
  const { user } = useAuthStore()
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  // Retrieve active tab from URL. If user isn’t SUPER_ADMIN, force active tab to account.
  let activeTab = searchParams.get('tab') || 'account'
  if (!isSuperAdmin && activeTab !== 'account') {
    activeTab = 'account'
  }

  const handleTabChange = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true })
  }

  return (
    <PageTransition>
      <Container className="!px-12">
        <FlexBox direction="col" justify="center" align="start" gap="gap-4" className="w-full cursor-default">
          <PageHeader title={title} />
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            className="flex w-full flex-col items-start gap-8"
            onValueChange={handleTabChange}
          >
            <div className="w-full border-b border-b-neutral-200 p-0">
              <TabsList className="text-sm font-semibold">
                <TabsTrigger value="account" className="data-[state=active]:font-bold">
                  Account
                </TabsTrigger>
                {isSuperAdmin && (
                  <>
                    <TabsTrigger value="template" className="data-[state=active]:font-bold">
                      Template
                    </TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:font-bold">
                      System
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </div>
            <TabsContent value="account" className="w-full">
              <AccountTab />
            </TabsContent>
            {isSuperAdmin && (
              <>
                <TabsContent value="template" className="w-full">
                  <TemplateTab />
                </TabsContent>
                <TabsContent value="system" className="w-full">
                  <SystemPasswordTab />
                </TabsContent>
              </>
            )}
          </Tabs>
        </FlexBox>
      </Container>
    </PageTransition>
  )
}
