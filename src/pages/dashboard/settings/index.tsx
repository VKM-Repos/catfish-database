import { Container } from 'src/components/layouts/container'
import PageTransition from 'src/components/animations/page-transition'
import { PageHeader } from 'src/components/layouts/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import AccountTab from './components/account-settings-tab'
import { FlexBox } from 'src/components/layouts/flexbox'
import TemplateTab from './components/template-settings-tab'

export default function Settings() {
  const title = 'Settings'
  const actions = <></> // button goes here
  return (
    <PageTransition>
      <Container>
        <FlexBox direction="col" justify="center" align="start" gap="gap-8" className="w-full cursor-default">
          {/* settings should be font semibold */}
          <PageHeader title={title} actions={actions} />
          {/* <Center>
            <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" />
          </Center> */}
          <Tabs defaultValue="account" className="flex w-full flex-col items-start gap-8">
            <TabsList className="px-3 text-sm font-semibold">
              <TabsTrigger value="account" className="font-semibold">
                Account
              </TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="w-full">
              <AccountTab />
            </TabsContent>
            <TabsContent value="template">
              <TemplateTab />
            </TabsContent>
          </Tabs>
        </FlexBox>
      </Container>
    </PageTransition>
  )
}
