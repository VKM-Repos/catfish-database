import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { useState } from 'react'
import { Heading } from 'src/components/ui/heading'
import { ReportModal } from 'src/pages/dashboard/home/get-started/report-modal'

export default function SamplingReportsTable() {
  const [farmReportOpen, setFarmReportOpen] = useState(false)

  const useGetSamplingReports = createGetQueryHook({
    endpoint: '/samplings',
    responseSchema: z.any(),
    queryKey: ['sampling-reports-table'],
  })
  const { data: samplingReports } = useGetSamplingReports()
  const openModal = () => {
    setFarmReportOpen(true)
  }
  const title = 'Sampling reports'
  const actions = samplingReports && samplingReports?.content.length > 0 && (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Submit sampling report</Text>
      </Button>
    </Inline>
  )
  return (
    <>
      <FlexBox direction="col" gap="gap-6" className="w-full">
        <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
          <Heading level={6}>{title}</Heading>
          {actions && <div>{actions}</div>}
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={samplingReports?.content ?? []}
          isLoading={false}
          emptyStateMessage="No sampling reports found"
        />
      </FlexBox>
      <ReportModal
        title="Sampling Report"
        open={farmReportOpen}
        redirect="daily-sampling-report"
        onOpenChange={setFarmReportOpen}
      />
    </>
  )
}
