import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { waterQualityColumns } from './water-quality-columns'

export default function FeedingReportsTable() {
  const useGetFeedingReports = createGetQueryHook({
    endpoint: '/feedings',
    responseSchema: z.any(),
    queryKey: ['feeding-reports'],
  })

  const useGetWaterReports = createGetQueryHook({
    endpoint: '/water-quality',
    responseSchema: z.any(),
    queryKey: ['water-quality-reports'],
  })
  const { data: feedingReports } = useGetFeedingReports()
  const { data: waterQualityReports } = useGetWaterReports()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Daily Feeding</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={feedingReports?.content ?? []}
        isLoading={false}
        emptyStateMessage="No feeding reports found"
      />

      <FlexBox gap="gap-unset" justify="between" align="center" className="mt-5 w-full">
        <Text className="text-xl font-semibold text-neutral-700">Water Quality Reports</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={waterQualityColumns}
        data={waterQualityReports?.content ?? []}
        isLoading={false}
        emptyStateMessage="No feeding reports found"
      />
    </FlexBox>
  )
}
