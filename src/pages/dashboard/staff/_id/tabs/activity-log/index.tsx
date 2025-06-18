import { FlexBox } from 'src/components/ui/flexbox'
import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { paginatedAuditResponseSchema } from 'src/schemas/auditLogSchema'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { useLocation } from 'react-router-dom'

export default function ActiviyLogTab() {
  const location = useLocation()
  const user = location.state?.user

  console.log('user........', user)
  const useGetAuditLog = createGetQueryHook({
    endpoint: `/audit-logs?direction=ASC&userId=${user.id}`,
    responseSchema: paginatedAuditResponseSchema,
    queryKey: ['activityLog'],
  })
  const { data: audits, isLoading } = useGetAuditLog()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <DataTable
        columns={columns}
        data={audits?.content ?? []}
        isLoading={isLoading}
        // showFilter={true}
        emptyStateMessage="No audits found"
        hideClusterFilter={true}
      />
    </FlexBox>
  )
}
