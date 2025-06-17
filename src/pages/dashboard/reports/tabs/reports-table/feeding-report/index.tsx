import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import { ReportModal } from 'src/pages/dashboard/home/get-started/report-modal'
import { useState } from 'react'
import { waterQualityColumns } from './water-quality-columns'

export default function FeedingReportsTable() {
  const [farmReportOpen, setFarmReportOpen] = useState(false)
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

  const openModal = () => {
    setFarmReportOpen(true)
  }
  const { data: feedingReports } = useGetFeedingReports()
  const { data: waterQualityReports } = useGetWaterQualityReports()

  const title = 'Feeding reports'
  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Submit feeding report</Text>
      </Button>
    </Inline>
  )
  console.log(waterQualityReports)

  return (
    <>
      <FlexBox direction="col" gap="gap-4" className="mb-10 w-full">
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          {actions && <div>{actions}</div>}
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={feedingReports?.content ?? []}
          isLoading={false}
          emptyStateMessage="No feeding reports found"
        />
        <Heading className="mt-10" level={6}>
          Water quality reports
        </Heading>
        <DataTable
          search={false}
          columns={waterQualityColumns}
          data={waterQualityReports?.content ?? []}
          isLoading={false}
          emptyStateMessage="No water quality reports found"
        />
      </FlexBox>
      <ReportModal
        title="Daily Farm Report"
        open={farmReportOpen}
        redirect="daily-farm-report"
        onOpenChange={setFarmReportOpen}
      />
    </>
  )
}
