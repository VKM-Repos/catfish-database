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
import { useAuthStore } from 'src/store/auth.store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'

const tabs = [
  { label: 'Feeding', value: 'feeding' },
  { label: 'Water Quality', value: 'water-quality' },
  { label: 'Fish Behavior', value: 'behavior' },
  { label: 'Fish Disease', value: 'disease' },
  { label: 'Mortality', value: 'mortality' },
]

export default function FeedingReportsTable() {
  const [farmReportOpen, setFarmReportOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Feeding')
  const { setStep } = useStepperStore()
  const [searchTerm, setSearchTerm] = useState('')
  const user = useAuthStore((state) => state.user)

  // Filtered tabs for search
  const filteredTabs = tabs.filter((tab) => tab.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const useGetFeedingReports = createGetQueryHook({
    endpoint: '/feedings?size=1000000',
    responseSchema: z.any(),
    queryKey: ['daily-feedings'],
  })

  const useGetWaterQualityReports = createGetQueryHook({
    endpoint: '/water-quality?size=1000000',
    responseSchema: z.any(),
    queryKey: ['water-quality'],
  })

  const useGetFishBehavior = createGetQueryHook({
    endpoint: '/behaviors?size=1000000',
    responseSchema: z.any(),
    queryKey: ['fish-behavior'],
  })

  const useGetFishDisease = createGetQueryHook({
    endpoint: '/diseases?size=1000000',
    responseSchema: z.any(),
    queryKey: ['fish-diseases'],
  })

  const useGetMortality = createGetQueryHook({
    endpoint: '/mortalities/fish-supplies?size=1000000',
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

  const title = user?.role === 'FARMER' ? 'Daily reports' : 'Feeding reports'
  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text className="text-[11px] lg:text-sm">Submit report</Text>
      </Button>
    </Inline>
  )
  return (
    <>
      {/* Mobile Select Dropdown */}
      <div className="mb-4 w-[50%] lg:hidden">
        <Select
          value={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(value)
            const tabIndex = tabs.findIndex((t) => t.value === value)
            setStep(tabIndex + 1)
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center justify-center gap-3 text-neutral-300">
              <SelectValue placeholder="Select a view" />
            </div>
          </SelectTrigger>
          <SelectContent className="z-[2000]">
            <Heading level={6}>Select view</Heading>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />

            {filteredTabs.length > 0 ? (
              filteredTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.label}>
                  {tab.label}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500">No results found</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <FlexBox direction="row" align="center" justify="between" className="mb-5 w-full">
        <Heading level={6} className="text-[14px] lg:text-xl">
          {selectedTab} reports
        </Heading>
        {actions && <div>{actions}</div>}
      </FlexBox>
      <Tabs defaultValue="feeding" className="flex w-full items-start gap-8">
        <TabsList className="hidden flex-col items-start justify-start text-sm font-semibold lg:flex">
          {tabs.map((tab, index) => (
            <VerticalTabsTrigger
              key={tab.value}
              onClick={() => {
                setSelectedTab(tab.label)
                setStep(index + 1)
              }}
              value={tab.value}
              className="data-[state=active]:font-semibold"
            >
              {tab.label}
            </VerticalTabsTrigger>
          ))}
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
