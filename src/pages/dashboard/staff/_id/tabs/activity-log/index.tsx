import { FlexBox } from 'src/components/ui/flexbox'
import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'

export default function ActiviyLogTab() {
  // const location = useLocation()
  // const user = location.state?.user

  // const useGetAuditLog = createGetQueryHook({
  //   endpoint: `/audit-logs?direction=ASC&userId=${user.id}`,
  //   responseSchema: paginatedAuditResponseSchema,
  //   queryKey: ['activityLog'],
  // })
  // const { data: audits, isLoading } = useGetAuditLog()
  const audits = { content: [] }
  const isLoading = false

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <DataTable
        columns={columns}
        data={audits?.content ?? []}
        isLoading={isLoading}
        emptyStateMessage="No audits found"
      />
    </FlexBox>
  )
}
