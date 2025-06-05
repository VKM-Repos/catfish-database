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
import { ReportModal } from 'src/pages/dashboard/home/get-started/report-modal'
import { Heading } from 'src/components/ui/heading'

export default function HarvestReportsTable() {
  const useGetSamplingReports = createGetQueryHook({
    endpoint: '/samplings/me',
    responseSchema: z.any(),
    queryKey: ['harvest-reports-table'],
  })
  const { data: samplingReports } = useGetSamplingReports()
  const [farmReportOpen, setFarmReportOpen] = useState(false)

  function extractHarvestObjectsWithCreatedAt(apiResponse: any) {
    if (!Array.isArray(apiResponse)) {
      return []
    }

    return apiResponse
      .filter((item) => item.harvest && typeof item.harvest === 'object')
      .map((item) => ({
        ...item.harvest,
        createdAt: item.createdAt,
      }))
  }
  const openModal = () => {
    setFarmReportOpen(true)
  }
  const harvestArray = extractHarvestObjectsWithCreatedAt(samplingReports?.content)
  const title = 'harvest reports'
  const actions = samplingReports && samplingReports?.content.length > 0 && (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Submit harvest report</Text>
      </Button>
    </Inline>
  )
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Heading level={6}>{title}</Heading>
        {actions && <div>{actions}</div>}
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={harvestArray ?? []}
        isLoading={false}
        emptyStateMessage="No Harvest report found"
      />
      <ReportModal
        title="Sampling Report"
        open={farmReportOpen}
        redirect="daily-harvest-report"
        onOpenChange={setFarmReportOpen}
      />
    </FlexBox>
  )
}
