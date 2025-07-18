import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { DataTable } from 'src/components/ui/data-table'
import { paginatedAuditResponseSchema } from 'src/schemas/auditLogSchema'
import React from 'react'

export function AuditLogTable() {
  const [filters, setFilters] = React.useState({
    actionType: '',
    startDate: '',
    endDate: '',
  })

  const useGetAuditsLog = createGetQueryHook({
    endpoint: '/audit-logs',
    responseSchema: paginatedAuditResponseSchema,
    queryKey: ['audits', { ...filters }],
  })

  const { data: audits, isLoading } = useGetAuditsLog({
    query: {
      direction: 'DESC',
      // direction: 'ASC',
      actionType: filters.actionType !== ' ' ? filters.actionType : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    },
  })

  // Called by DataTable when Apply is clicked
  const handleFilterApply = (appliedFilters: { actionType: string; startDate: string; endDate: string }) => {
    setFilters(appliedFilters)
  }

  console.log('audits: ', audits)

  return (
    <DataTable
      columns={columns}
      data={audits?.content ?? []}
      isLoading={isLoading}
      emptyStateMessage="No audits found"
      hideClusterFilter={true}
      onFilterApply={handleFilterApply}
    />
  )
}
