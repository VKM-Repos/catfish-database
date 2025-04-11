import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import AccountTab from './components/tabs/account-settings-tab'
import { FlexBox } from 'src/components/ui/flexbox'
import TemplateTab from './components/tabs/template-settings-tab'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SystemPasswordTab from './components/tabs/system-password-settings-tab'

export default function Settings() {
  const title = 'Settings'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'account'

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
            className="flex w-full flex-col items-start gap-8"
            onValueChange={handleTabChange}
          >
            <div className="w-full border-b border-b-neutral-200 p-0">
              <TabsList className="text-sm font-semibold">
                <TabsTrigger value="account" className="data-[state=active]:font-bold">
                  Account
                </TabsTrigger>
                <TabsTrigger value="template" className="data-[state=active]:font-bold">
                  Template
                </TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:font-bold">
                  System
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="account" className="w-full">
              <AccountTab />
            </TabsContent>
            <TabsContent value="template" className="w-full">
              <TemplateTab />
            </TabsContent>
            <TabsContent value="system" className="w-full">
              <SystemPasswordTab />
            </TabsContent>
          </Tabs>
        </FlexBox>
      </Container>
    </PageTransition>
  )
}
