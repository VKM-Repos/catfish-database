// import { DataTable } from 'src/components/ui/data-table'
import { DataTable, FilterConfig, PaginationConfig, SortingConfig } from 'src/components/ui/enhance-data-tabe'
import { columns } from './columns'
import { memo, useState } from 'react'
import { createGetQueryHook } from 'src/api/hooks/useGet'
// import { DataTable } from 'src/components/ui/data-table'
import { z } from 'zod'

const useGetRoles = createGetQueryHook({
  endpoint: '/roles',
  responseSchema: z.any(),
  queryKey: ['roles'],
})

const useGetClusters = createGetQueryHook({
  endpoint: '/clusters',
  responseSchema: z.any(),
  queryKey: ['clusters'],
})

const useGetUsers = createGetQueryHook({
  endpoint: '/users?size=1000',
  responseSchema: z.any(),
  queryKey: ['users'],
})

interface UsersTableProps {
  data: any[]
  isLoading: boolean
}
// const title = 'Users'

function UsersTableComponent({ data, isLoading }: UsersTableProps) {
  // Pagination state
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  // Fetch all users at once (no page/size query)
  const { data: usersResp = [], isLoading: loadingUsers } = useGetUsers()

  const { data: rolesResp, isLoading: loadingRoles } = useGetRoles()
  const { data: clustersResp, isLoading: loadingClusters } = useGetClusters()

  const STATUSES = ['Active', 'Deactivated']

  // Example filter configs
  const filterConfigs: FilterConfig[] = [
    {
      key: 'cluster.name',
      label: 'Cluster',
      type: 'select',
      options: (clustersResp ?? []).filter(Boolean).map((c: any) => ({ value: c.name, label: c.name })),
      placeholder: loadingClusters ? 'Loading…' : 'Cluster',
      loading: loadingClusters,
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: (rolesResp ?? []).filter(Boolean).map((c: any) => ({ value: c.name, label: c.name })),
      placeholder: loadingRoles ? 'Loading…' : 'Role',
      loading: loadingRoles,
    },
    {
      key: 'accountNonLocked',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Deactivated', label: 'Deactivated' },
      ],
      placeholder: 'Select Status',
    },
  ]

  // Client-side pagination
  const totalElements = Array.isArray(usersResp.content) ? usersResp.content.length : 0
  const totalPages = Math.ceil(totalElements / size)
  const paginatedUsers = Array.isArray(usersResp.content)
    ? usersResp.content.slice(page * size, page * size + size)
    : []

  // Pagination config for client-side
  const pagination: PaginationConfig = {
    page: page + 1, // DataTable expects 1-based page
    size: size,
    totalElements: totalElements,
    totalPages: totalPages,
    onPageChange: (newPage: number) => setPage(newPage - 1), // Convert to 0-based for API
    onSizeChange: (newSize: number) => {
      setSize(newSize)
      setPage(0) // Reset to first page when size changes
    },
  }

  // Example sorting config
  const sorting: SortingConfig = {
    sortBy: 'name',
    direction: 'ASC',
    onSortChange: (field, direction) => console.log('Sort:', field, direction),
  }
  // console.log("paginatedUsers: ",usersResp.content);

  return (
    <DataTable
      columns={columns}
      data={usersResp.content}
      isLoading={loadingUsers}
      emptyStateMessage="No results found"
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
      sorting={sorting}
      // Row click
      onRowClick={(row) => console.log('Row clicked:', row)}
      // Custom styling
      className="my-custom-class"
    />
  )
}

// Memoize the component to prevent unnecessary re-renders
export const UsersTable = memo(UsersTableComponent)
