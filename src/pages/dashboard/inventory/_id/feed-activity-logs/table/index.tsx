import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'

export default function FeedActivityLogsTable({ data, isLoading, item }: any) {
  const mergedData = (data?.content ?? []).map((row: any) => ({
    ...row,
    sizeInMm: item.sizeInMm,
    type: item?.type,
    totalCost: item ? item.costPerKg * item.quantityInKg : null,
  }))

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <DataTable
        search={false}
        columns={columns}
        data={mergedData}
        isLoading={isLoading}
        emptyStateMessage="No logs found"
      />
    </FlexBox>
  )
}
