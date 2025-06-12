import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'

export default function FeedActivityLogsTable({ data }: any) {
  return (
    <>
      <FlexBox direction="col" gap="gap-6" className="w-full">
        <DataTable
          search={false}
          columns={columns}
          data={data?.content ?? []}
          isLoading={false}
          emptyStateMessage="No logs found"
        />
      </FlexBox>
    </>
  )
}
