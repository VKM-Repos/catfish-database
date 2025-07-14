import { useState } from 'react'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { DataTable, FilterConfig, PaginationConfig } from 'src/components/ui/enhance-data-tabe'
// import { DataTable } from 'src/components/ui/data-table'
import { paginatedAuditResponseSchema } from 'src/schemas/auditLogSchema'

const useGetAuditsLog = createGetQueryHook({
  endpoint: '/audit-logs',
  responseSchema: paginatedAuditResponseSchema,
  queryKey: ['audits'],
})

export function AuditLogTable() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  //

  const { data: audits = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 1 }, isLoading } =
    useGetAuditsLog({ query: { page, size, direction: 'DESC' } })

  // Pagination config from API response
  const pagination: PaginationConfig = {
    page: audits.page + 1, // DataTable expects 1-based page
    size: audits.size,
    totalElements: audits.totalElements,
    totalPages: audits.totalPages,
    onPageChange: (newPage: number) => setPage(newPage - 1), // Convert to 0-based for API
    onSizeChange: (newSize: number) => {
      setSize(newSize)
      setPage(0) // Reset to first page when size changes
    },
  }

  // Example filter configs
  const filterConfigs: FilterConfig[] = [
    {
      key: 'actionType',
      label: 'Action Type',
      type: 'select',
      options: [
        { value: 'CREATE', label: 'CREATE' },
        { value: 'UPDATE', label: 'UPDATE' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'LOG IN', label: 'UPDATE' },
        { value: 'LOG OUT', label: 'UPDATE' },
      ],
      placeholder: isLoading ? 'Loading…' : 'Action',
      loading: isLoading,
    },
    {
      key: 'timestamp',
      label: 'Date Range',
      type: 'daterange',
      // options: (rolesResp ?? []).filter(Boolean).map((c: any) => ({ value: c.name, label: c.name })),
      placeholder: isLoading ? 'Loading…' : 'Date',
      loading: isLoading,
    },
  ]

  console.log('audits: ', audits)

  return (
    <DataTable
      columns={columns}
      data={audits?.content || []}
      isLoading={isLoading}
      emptyStateMessage="No audits found"
      // Search
      search={true}
      searchPlaceholder="Search users..."
      // Filters
      enableFilters={true}
      filterConfigs={filterConfigs}
      // Pagination
      enablePagination={true}
      pagination={pagination}
      // Sorting
      enableSorting={true}
      // sorting={sorting}
      // Row click
      onRowClick={(row) => console.log('Row clicked:', row)}
      // Custom styling
      className="my-custom-class"
    />
    // <DataTable
    //   columns={columns}
    //   data={audits?.content ?? []}
    //   isLoading={isLoading}
    //   // showFilter={true}
    //   emptyStateMessage="No audits found"
    //   hideClusterFilter={true}
    // />
  )
}
