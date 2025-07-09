// import { DataTable } from 'src/components/ui/data-table'
import { DataTable, FilterConfig, PaginationConfig, SortingConfig } from 'src/components/ui/enhance-data-tabe'
import { columns } from './columns'
import { memo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createGetQueryHook } from 'src/api/hooks/useGet'
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
  endpoint: '/users',
  responseSchema: z.any(),
  queryKey: ['users'],
})

interface UsersTableProps {
  data: any[]
  isLoading: boolean
}
// const title = 'Users'

function UsersTableComponent({ data, isLoading }: UsersTableProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const { data: rolesResp, isLoading: loadingRoles } = useGetRoles()
  const { data: clustersResp, isLoading: loadingClusters } = useGetClusters()

  const STATUSES = ['Active', 'Deactivated']

  // Example filter configs
  const filterConfigs: FilterConfig[] = [
    {
      key: 'cluster',
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
      options: (rolesResp ?? []).filter(Boolean).map((c: any) => ({ value: c.id, label: c.name })),
      placeholder: loadingRoles ? 'Loading…' : 'Role',
      loading: loadingRoles,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Deactivated', label: 'Deactivated' },
      ],
      placeholder: 'Select Status',
    },
  ]

  // Example pagination config
  const pagination: PaginationConfig = {
    page: 1,
    size: 10,
    totalElements: 100,
    totalPages: 10,
    onPageChange: (page) => console.log('Page:', page),
    onSizeChange: (size) => console.log('Size:', size),
  }

  // Example sorting config
  const sorting: SortingConfig = {
    sortBy: 'name',
    direction: 'ASC',
    onSortChange: (field, direction) => console.log('Sort:', field, direction),
  }

  // Example applied filters
  const appliedFilters = {
    cluster: 'Cluster A',
    status: 'Active',
  }
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={false}
      emptyStateMessage="No results found"
      // Search
      search={true}
      searchPlaceholder="Search users..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      // Filters
      enableFilters={true}
      filterConfigs={filterConfigs}
      appliedFilters={appliedFilters}
      onFilterChange={(filters) => console.log('Filters:', filters)}
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

// key: string
//   label: string
//   type: 'select' | 'multiselect' | 'input' | 'daterange' | 'boolean'
//   options?: Array<{ value: any; label: string }>
//   placeholder?: string
//   fetchOptions?: () => Promise<Array<{ value: string; label: string }>>
//   loading?: boolean

// Memoize the component to prevent unnecessary re-renders
export const UsersTable = memo(UsersTableComponent)
