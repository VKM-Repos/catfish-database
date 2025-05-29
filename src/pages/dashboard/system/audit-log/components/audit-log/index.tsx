import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { DataTable } from 'src/components/ui/data-table'
import { paginatedAuditResponseSchema } from 'src/schemas/auditLogSchema'

export function AuditLogTable() {
  const useGetAuditsLog = createGetQueryHook({
    endpoint: '/audit-logs?direction=DESC',
    responseSchema: paginatedAuditResponseSchema,
    queryKey: ['audits'],
  })
  const { data: audits, isLoading } = useGetAuditsLog()

  console.log('audits: ', audits)

  return (
    <DataTable
      columns={columns}
      data={audits?.content ?? []}
      isLoading={isLoading}
      showFilter={true}
      emptyStateMessage="No audits found"
    />
  )
}
