import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import Skeleton from './skeleton'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import type { Cluster } from 'src/types/cluster.types'
import { useAuthStore } from 'src/store/auth.store'
import { useLocation } from 'react-router-dom'
import { Text } from 'src/components/ui/text'
import { Input } from './input'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  // showFilter?: boolean
  emptyStateMessage?: string
  hideClusterFilter?: boolean
  search?: boolean
  hidePagination?: boolean
  onFilterApply?: (filters: { actionType: string; startDate: string; endDate: string }) => void // <-- add this line
}

export function DataTable<TData>({
  columns,
  data,
  search = true,
  isLoading = false,
  emptyStateMessage = 'No results found',
  hideClusterFilter = false,
  hidePagination = false,
  onFilterApply,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [selectedCluster, setSelectedCluster] = React.useState<string>('')
  const [showFilter, setShowFilter] = React.useState(false)
  const startDateInputRef = React.useRef<HTMLInputElement>(null)
  const endDateInputRef = React.useRef<HTMLInputElement>(null)

  const handleStartDateClick = () => {
    startDateInputRef.current?.showPicker()
  }

  const handleEndDateClick = () => {
    endDateInputRef.current?.showPicker()
  }

  // const normalizeClusterName = (name: string) => name.replace(/-/g, '')
  const location = useLocation()
  const isClustersPage = location.pathname.includes('/clusters')
  const filteredData = React.useMemo(() => {
    if (!selectedCluster || selectedCluster === 'null') return data
    setColumnFilters([])
    setGlobalFilter('')
    const filtered = data.filter((item) => {
      const clusterName = (item as any).cluster?.name || ''
      return clusterName === selectedCluster
    })
    return filtered
  }, [data, selectedCluster])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterValue.toLowerCase())
      }
      return false
    },
  })

  const handleClusterChange = (value: string) => {
    setColumnFilters([])
    setGlobalFilter('')
    setSelectedCluster(value)
    table.setPageIndex(0)
  }

  const renderSkeletonRows = (columns: ColumnDef<TData>[]) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${index}-${colIndex}`} className="h-12">
            <Skeleton className="h-4 w-full rounded" />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  const user = useAuthStore((state) => state.user)
  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.any(),
    queryKey: ['clusters_for_data_table'],
    options: {
      enabled: user?.role === 'SUPER_ADMIN',
    },
  })

  const { data: clusters } = useGetClusters()

  const actionTypes = [
    { name: 'CREATE' },
    { name: 'UPDATE' },
    { name: 'DELETE' },
    { name: 'LOG IN' },
    { name: 'LOG OUT' },
  ]

  // Helper to get today and 1 week ago in yyyy-mm-dd
  function getToday() {
    const d = new Date()
    return d.toISOString().split('T')[0]
    // return d.toISOString().slice(0, 10)
  }
  function getOneWeekAgo() {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    // return d.toISOString().slice(0, 10)
    return d.toISOString().split('T')[0]
  }

  // Local filter state for filter UI (not applied until 'Apply' is clicked)
  const [pendingActionType, setPendingActionType] = React.useState<string>(' ')
  const [pendingStartDate, setPendingStartDate] = React.useState<string>(getOneWeekAgo())
  const [pendingEndDate, setPendingEndDate] = React.useState<string>(getToday())

  // Applied filter state (used for actual filtering/fetching)
  const [appliedActionType, setAppliedActionType] = React.useState<string>(' ')
  const [appliedStartDate, setAppliedStartDate] = React.useState<string>('')
  const [appliedEndDate, setAppliedEndDate] = React.useState<string>('')

  // State for invalid date range
  const [invalidDateRange, setInvalidDateRange] = React.useState(false)

  // Handler for Apply button
  const handleApplyFilters = () => {
    // Prevent applying if start date is after end date
    if (pendingStartDate && pendingEndDate && pendingStartDate > pendingEndDate) {
      setInvalidDateRange(true)
      return
    } else {
      setInvalidDateRange(false)
    }
    setAppliedActionType(pendingActionType)
    setAppliedStartDate(pendingStartDate)
    setAppliedEndDate(pendingEndDate)
    setShowFilter(false)

    // Optionally call a prop callback here
    if (typeof (onFilterApply as any) === 'function') {
      ;(onFilterApply as any)({
        actionType: pendingActionType,
        startDate: pendingStartDate ? new Date(pendingStartDate).toISOString() : '',
        endDate: pendingEndDate ? new Date(pendingEndDate).toISOString() : '',
      })
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setPendingStartDate(dateValue)
    // const timeValue = form.getValues('feedTime')
    // handleDateTimeChange(dateValue, timeValue)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setPendingEndDate(dateValue)
    // const timeValue = form.getValues('feedTime')
    // handleDateTimeChange(dateValue, timeValue)
  }

  // Handler for Clear Filters
  const handleClearFilters = () => {
    setPendingActionType(' ')
    setPendingStartDate('')
    setPendingEndDate('')
  }
  return (
    <div className="w-full">
      {search && (
        <div className="mb-8 min-h-[80px] items-center  rounded-md bg-neutral-50 px-[24px] py-[20px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2">
              <SolarIconSet.MinimalisticMagnifer />
              <input
                className="w-[390px] border-none focus:outline-none focus-visible:border-none focus-visible:ring-primary-500"
                placeholder="Search..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
              />
            </div>
            <div className="w-[20%] justify-center self-center">
              {!hideClusterFilter && !isClustersPage && user?.role === 'SUPER_ADMIN' && (
                <Select value={selectedCluster} onValueChange={handleClusterChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All clusters" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="null">All clusters</SelectItem>
                    {clusters?.map((cluster: Cluster) => (
                      <SelectItem key={cluster.name} value={cluster.name}>
                        {cluster.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {hideClusterFilter && (
                <Button
                  variant="ghost"
                  className="flex items-center justify-center  gap-2 p-0 text-primary-500"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <SolarIconSet.Filter size={20} />
                  <Text className="">{showFilter ? 'hide filters' : 'show filters'}</Text>
                </Button>
              )}
            </div>
          </div>
          {showFilter && hideClusterFilter && (
            <div className="flex items-center justify-between">
              <div className="my-3 flex-1">
                <Text variant="label">Action type</Text>
                <Select value={pendingActionType} onValueChange={setPendingActionType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value=" ">All Activities</SelectItem>
                    {actionTypes?.map((action: any) => (
                      <SelectItem key={action.name} value={action.name}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mx-3 flex-1">
                <Text variant="label">Date range</Text>
                <div className="flex gap-2">
                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <SolarIconSet.Calendar size={26} className="m-2" onClick={handleStartDateClick} />
                    <div className="w-full">
                      <Input
                        data-placeholder={'Pick start date'}
                        type="date"
                        value={pendingStartDate}
                        onChange={(e) => {
                          handleStartDateChange(e)
                          // handleInputChange('date', e.target.value)
                        }}
                        ref={startDateInputRef}
                        // onChange={(e) => setPendingStartDate(e.target.value)}
                        className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                      />
                    </div>
                  </div>

                  <div
                    className={`focus-within:ring-offset-background flex max-h-fit items-center rounded-md border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2`}
                  >
                    <SolarIconSet.Calendar size={26} className="m-2" onClick={handleEndDateClick} />
                    <div className="w-full">
                      <Input
                        // data-placeholder={'Pick end date'}
                        type="date"
                        value={pendingEndDate}
                        onChange={(e) => {
                          handleEndDateChange(e)
                          // handleInputChange('date', e.target.value)
                        }}
                        ref={endDateInputRef}
                        // onChange={(e) => setPendingEndDate(e.target.value)}
                        className="md:text-md text-md !w-full border-0 px-3 [-moz-appearance:textfield] [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:hidden"
                      />
                    </div>
                  </div>
                </div>
                {invalidDateRange && (
                  <Text className="text-sm text-error-500">Start date cannot be after end date.</Text>
                )}
              </div>

              <div className="flex flex-1 flex-row items-end gap-2 self-center ">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700"
                  onClick={handleClearFilters}
                >
                  <SolarIconSet.TrashBinMinimalistic size={16} />
                  Clear filters
                </Button>
                {/* <Button variant="outline" onClick={handleClearFilters}>
                  <Text variant="label">Clear Filters</Text>
                </Button> */}

                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-2 self-center"
                  onClick={handleApplyFilters}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-neutral-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows(columns)
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        {!hidePagination && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-normal">Results per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <SolarIconSet.AltArrowLeft size={26} />
                </Button>
                {/*
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                let pageIndex
                const currentPage = table.getState().pagination.pageIndex
                const pageCount = table.getPageCount()

                if (pageCount <= 5) {
                  pageIndex = i
                } else if (currentPage < 3) {
                  pageIndex = i
                } else if (currentPage > pageCount - 4) {
                  pageIndex = pageCount - 5 + i
                } else {
                  pageIndex = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageIndex}
                    variant={currentPage === pageIndex ? 'outline' : 'ghost'}
                    className={`flex w-14 items-center justify-start px-2 py-2 ${
                      currentPage !== pageIndex ? 'hidden' : 'block'
                    }`}
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                )
              })}
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                of {table.getPageCount()} pages
              </div> */}
                <Button
                  variant="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <SolarIconSet.AltArrowRight size={26} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
