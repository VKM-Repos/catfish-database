import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, VerticalTabsTrigger } from 'src/components/ui/tabs'
import { useSearchParams } from 'react-router-dom'
import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { waterQualityColumns } from './water-quality-columns'
import { fishBehaviorColumn } from './fish-behavior-column'
import { fishDiseaseColumn } from './fish-disease-column'
import { mortalityColumn } from './mortality-column'
import { ReportModal } from 'src/pages/dashboard/home/get-started/report-modal'
import { useStepperStore } from 'src/store/daily-feeding-stepper-store'

export default function FeedingReportsTable() {
  const [farmReportOpen, setFarmReportOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Daily')
  const { setStep } = useStepperStore()

  const useGetFeedingReports = createGetQueryHook({
    endpoint: '/feedings',
    responseSchema: z.any(),
    queryKey: ['daily-feedings'],
  })

  const useGetWaterQualityReports = createGetQueryHook({
    endpoint: '/water-quality',
    responseSchema: z.any(),
    queryKey: ['water-quality'],
  })

  const useGetFishBehavior = createGetQueryHook({
    endpoint: '/behaviors',
    responseSchema: z.any(),
    queryKey: ['fish-behavior'],
  })

  const useGetFishDisease = createGetQueryHook({
    endpoint: '/diseases',
    responseSchema: z.any(),
    queryKey: ['fish-diseases'],
  })

  const useGetMortality = createGetQueryHook({
    endpoint: '/mortalities/fish-supplies',
    responseSchema: z.any(),
    queryKey: ['fish-mortality'],
  })

  const openModal = () => {
    setFarmReportOpen(true)
  }
  const [searchParams] = useSearchParams()

  const { data: feedingReports } = useGetFeedingReports()
  const { data: waterQualityReports } = useGetWaterQualityReports()
  const { data: fishBehaviorReport } = useGetFishBehavior()
  const { data: fishDiseaseReport } = useGetFishDisease()
  const { data: mortalityReport } = useGetMortality()
  const activeTab = searchParams.get('tab') || 'feeding'

  const title = 'Daily reports'
  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Submit report</Text>
      </Button>
    </Inline>
  )
  return (
    <>
      <FlexBox direction="row" align="center" justify="between" className="mb-5 w-full pl-[160px]">
        <Heading level={6}>{selectedTab} reports</Heading>
        {actions && <div>{actions}</div>}
      </FlexBox>
      <Tabs defaultValue="feeding" className="flex w-full items-start gap-8">
        <TabsList className="flex flex-col items-start justify-start text-sm font-semibold">
          <VerticalTabsTrigger
            onClick={() => {
              setSelectedTab('Daily')
              setStep(1)
            }}
            value="feeding"
            className="data-[state=active]:font-semibold"
          >
            Feeding
          </VerticalTabsTrigger>
          <VerticalTabsTrigger
            onClick={() => {
              setSelectedTab('Water Quality')
              setStep(2)
            }}
            value="water-quality"
            className="data-[state=active]:font-semibold"
          >
            Water quality
          </VerticalTabsTrigger>
          <VerticalTabsTrigger
            onClick={() => {
              setSelectedTab('Fish Behavior')
              setStep(3)
            }}
            value="behavior"
            className="data-[state=active]:font-semibold"
          >
            Fish behavior
          </VerticalTabsTrigger>
          <VerticalTabsTrigger
            onClick={() => {
              setSelectedTab('Fish Disease')
              setStep(4)
            }}
            value="disease"
            className="data-[state=active]:font-semibold"
          >
            Fish disease
          </VerticalTabsTrigger>
          <VerticalTabsTrigger
            onClick={() => {
              setSelectedTab('Mortality')
              setStep(5)
            }}
            value="mortality"
            className="data-[state=active]:font-semibold"
          >
            Mortality
          </VerticalTabsTrigger>
        </TabsList>
        <TabsContent value="feeding" className="w-full">
          <DataTable
            search={false}
            columns={columns}
            data={feedingReports?.content ?? []}
            isLoading={false}
            emptyStateMessage="No feeding reports found"
          />
        </TabsContent>
        <TabsContent value="water-quality" className="w-full">
          <DataTable
            search={false}
            columns={waterQualityColumns}
            data={waterQualityReports?.content ?? []}
            isLoading={false}
            emptyStateMessage="No water quality reports found"
          />
        </TabsContent>
        <TabsContent value="behavior" className="w-full">
          <DataTable
            search={false}
            columns={fishBehaviorColumn}
            data={fishBehaviorReport?.content ?? []}
            isLoading={false}
            emptyStateMessage="No fish behavior reports found"
          />
        </TabsContent>
        <TabsContent value="disease" className="w-full">
          <DataTable
            search={false}
            columns={fishDiseaseColumn}
            data={fishDiseaseReport?.content ?? []}
            isLoading={false}
            emptyStateMessage="No fish disease reports found"
          />
        </TabsContent>
        <TabsContent value="mortality" className="w-full">
          <DataTable
            search={false}
            columns={mortalityColumn}
            data={mortalityReport?.content ?? []}
            isLoading={false}
            emptyStateMessage="No mortality reports found"
          />
        </TabsContent>
      </Tabs>
      <ReportModal
        title="Daily Report"
        open={farmReportOpen}
        redirect="daily-farm-report"
        from="daily-feeding-report-list"
        onOpenChange={setFarmReportOpen}
      />
    </>
  )
}
