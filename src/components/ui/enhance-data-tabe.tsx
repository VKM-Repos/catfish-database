// components/ui/enhanced-data-table.tsx
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
import { Text } from './text'
import { cn } from 'src/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from './popover'

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'input' | 'daterange' | 'boolean'
  options?: Array<{ value: any; label: string }>
  placeholder?: string
  fetchOptions?: () => Promise<Array<{ value: string; label: string }>>
  loading?: boolean
}

export interface PaginationConfig {
  page: number
  size: number
  totalElements: number
  totalPages: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

export interface SortingConfig {
  sortBy: string
  direction: 'ASC' | 'DESC'
  onSortChange: (field: string, direction: 'ASC' | 'DESC') => void
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyStateMessage?: string

  // Search configuration
  search?: boolean
  searchPlaceholder?: string
  // Removed: searchValue, onSearchChange

  // Filter configuration
  enableFilters?: boolean
  filterConfigs?: FilterConfig[]
  // Removed: appliedFilters, onFilterChange

  // Pagination configuration
  enablePagination?: boolean
  pagination?: PaginationConfig

  // Sorting configuration
  enableSorting?: boolean
  sorting?: SortingConfig

  // Custom row actions
  onRowClick?: (row: TData) => void

  // Custom styling
  className?: string
}

function FilterSelect({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: any
  onChange: (value: any) => void
}) {
  const [open, setOpen] = React.useState(false)

  if (config.type === 'boolean') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col">
          <Text size="base" className="mb-1">
            {config.label}
          </Text>
          <PopoverTrigger asChild>
            <Button
              variant="neutral"
              size="sm"
              className="flex min-w-[180px] justify-between gap-x-2 !border border-neutral-200 bg-white text-sm"
              disabled={config.loading}
            >
              {config.loading
                ? 'Loading...'
                : value === true
                ? 'Active'
                : value === false
                ? 'Inactive'
                : config.placeholder || config.label}
              <SolarIconSet.AltArrowDown size={14} />
            </Button>
          </PopoverTrigger>
        </div>

        <PopoverContent className="flex max-h-64 w-52 flex-col gap-1 overflow-y-scroll p-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-sm hover:bg-primary-100"
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
          >
            All {config.label}
          </Button>
          <Button
            variant={value === true ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start text-sm hover:bg-primary-100"
            onClick={() => {
              onChange(true)
              setOpen(false)
            }}
          >
            Active
          </Button>
          <Button
            variant={value === false ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start text-sm hover:bg-primary-100"
            onClick={() => {
              onChange(false)
              setOpen(false)
            }}
          >
            Inactive
          </Button>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col">
        <Text size="base" className="mb-1">
          {config.label}
        </Text>
        <PopoverTrigger asChild>
          <Button
            variant="neutral"
            size="sm"
            className="flex min-w-[180px] justify-between gap-x-2 !border border-neutral-200 bg-white text-sm capitalize"
            disabled={config.loading}
          >
            {config.loading
              ? 'Loading...'
              : value
              ? config.options?.find((opt) => opt && opt.value === value)?.label || value
              : config.placeholder || config.label}
            <SolarIconSet.AltArrowDown size={14} />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="flex max-h-64 w-52 flex-col gap-1 overflow-y-scroll p-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-sm hover:bg-primary-100"
          onClick={() => {
            onChange(undefined)
            setOpen(false)
          }}
        >
          All {config.label}
        </Button>
        {config.options?.filter(Boolean).map((option) => (
          <Button
            key={option.value}
            variant={option.value === value ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start text-sm hover:bg-primary-100"
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
          >
            {option.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function FilterPill({ label, value, onRemove }: { label: string; value: any; onRemove: () => void }) {
  const displayValue = typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value.toString()

  return (
    <div className="flex items-center gap-2 rounded-full border border-primary-300 bg-primary-100 px-3 py-0.5 text-sm">
      <Text size="xs" className="font-medium text-primary-400">
        {label}: {displayValue}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 text-primary-500 hover:text-primary-700"
        onClick={onRemove}
      >
        <SolarIconSet.CloseCircle size={12} />
      </Button>
    </div>
  )
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyStateMessage = 'No results found',
  search = true,
  searchPlaceholder = 'Search...',
  // Removed: searchValue, onSearchChange
  enableFilters = false,
  filterConfigs = [],
  // Removed: appliedFilters, onFilterChange
  enablePagination = true,
  pagination,
  enableSorting = false,
  sorting,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [showFilters, setShowFilters] = React.useState(false)
  const [tempFilters, setTempFilters] = React.useState<Record<string, any>>({})
  const [currentPageInput, setCurrentPageInput] = React.useState('')

  // Internal sorting state (fallback when no external sorting provided)
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])

  // Internal search state
  const [internalSearchValue, setInternalSearchValue] = React.useState('')
  // Internal applied filters state
  const [appliedInternalFilters, setAppliedInternalFilters] = React.useState<Record<string, any>>({})

  // Initialize temp filters with applied filters
  React.useEffect(() => {
    setTempFilters(appliedInternalFilters)
  }, [appliedInternalFilters])

  // Calculate pagination values safely
  const paginationData = React.useMemo(() => {
    if (pagination) {
      return {
        currentPage: Math.max(1, pagination.page || 1),
        pageSize: Math.max(1, pagination.size || 10),
        totalElements: Math.max(0, pagination.totalElements || 0),
        totalPages: Math.max(1, pagination.totalPages || 1),
      }
    }

    // For non-paginated data, calculate from data
    const pageSize = 10
    const totalElements = data.length
    const totalPages = Math.ceil(totalElements / pageSize)

    return {
      currentPage: 1,
      pageSize,
      totalElements,
      totalPages: Math.max(1, totalPages),
    }
  }, [pagination, data.length])

  // Update current page input when pagination changes
  React.useEffect(() => {
    setCurrentPageInput(paginationData.currentPage.toString())
  }, [paginationData.currentPage])

  // Filter data based on search value and applied filters
  const filteredData = React.useMemo(() => {
    let filtered = data
    // Apply filters
    if (Object.keys(appliedInternalFilters).length > 0) {
      filtered = filtered.filter((row: any) => {
        return Object.entries(appliedInternalFilters).every(([key, value]) => {
          if (value === undefined || value === null || value === '') return true
          // Find the filter config to determine type
          const config = filterConfigs.find((c) => c.key === key)
          if (!config) return true
          if (config.type === 'select' || config.type === 'input' || config.type === 'boolean') {
            // For nested fields (e.g., cluster.name), support dot notation
            const fieldValue = key.includes('.') ? key.split('.').reduce((acc, k) => acc?.[k], row) : row[key]
            if (config.type === 'boolean') {
              return fieldValue === value
            }
            return String(fieldValue).toLowerCase() === String(value).toLowerCase()
          }
          // Add more filter types as needed
          return true
        })
      })
    }
    // Apply search
    if (internalSearchValue) {
      filtered = filtered.filter((row: any) =>
        Object.values(row).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(internalSearchValue.toLowerCase()),
        ),
      )
    }
    return filtered
  }, [data, internalSearchValue, appliedInternalFilters, filterConfigs])

  // Table configuration
  const table = useReactTable({
    data: filteredData, // Use filteredData for the table
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination && !pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: enableSorting && !sorting ? setInternalSorting : undefined,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting: sorting ? [{ id: sorting.sortBy, desc: sorting.direction === 'DESC' }] : internalSorting,
    },
    manualPagination: !!pagination,
    manualSorting: !!sorting,
    pageCount: paginationData.totalPages,
  })

  // Handle search change - FIXED: Now properly calls the provided handler
  // const handleSearchChange = React.useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value
  //     onSearchChange?.(value)
  //   },
  //   [onSearchChange],
  // )

  // Handle filter changes
  const handleFilterChange = (filterKey: string, value: any) => {
    setTempFilters((prev) => ({ ...prev, [filterKey]: value }))
  }

  // Apply filters
  const applyFilters = () => {
    setAppliedInternalFilters({ ...tempFilters })
    // Do NOT close the filter panel here
  }

  // Clear filters
  const clearFilters = () => {
    setTempFilters({})
    setAppliedInternalFilters({})
    // if (onFilterChange) { // Removed: onFilterChange
    //   onFilterChange({});
    // }
  }

  // Remove single filter
  const removeSingleFilter = (filterKey: string) => {
    const updatedFilters = { ...appliedInternalFilters }
    delete updatedFilters[filterKey]
    setAppliedInternalFilters(updatedFilters)
    setTempFilters(updatedFilters)
    // if (onFilterChange) { // Removed: onFilterChange
    //   onFilterChange(updatedFilters);
    // }
  }

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (sorting) {
      const newDirection = sorting.sortBy === columnId && sorting.direction === 'ASC' ? 'DESC' : 'ASC'
      sorting.onSortChange(columnId, newDirection)
    }
  }

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, paginationData.totalPages))
    if (pagination) {
      pagination.onPageChange(validPage)
    } else {
      table.setPageIndex(validPage - 1)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    if (pagination) {
      pagination.onSizeChange(newSize)
    } else {
      table.setPageSize(newSize)
      table.setPageIndex(0)
    }
  }

  // Handle manual page input
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPageInput(e.target.value)
  }

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(currentPageInput, 10)
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= paginationData.totalPages) {
        handlePageChange(pageNumber)
      } else {
        setCurrentPageInput(paginationData.currentPage.toString())
      }
    }
  }

  const handlePageInputBlur = () => {
    const pageNumber = parseInt(currentPageInput, 10)
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > paginationData.totalPages) {
      setCurrentPageInput(paginationData.currentPage.toString())
    }
  }

  // Render skeleton rows
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

  // Check if there are active filters
  const hasActiveFilters = Object.keys(appliedInternalFilters).some(
    (key) =>
      appliedInternalFilters[key] !== undefined &&
      appliedInternalFilters[key] !== null &&
      appliedInternalFilters[key] !== '',
  )

  return (
    <div className={cn('w-full', className)}>
      {/* Search and Filter Bar */}
      {search && (
        <div className="mb-4 min-h-[5rem] w-full cursor-default rounded-md bg-neutral-50 shadow-sm">
          <div className="flex w-full flex-1 items-center justify-between p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2">
                <SolarIconSet.MinimalisticMagnifer />
                <input
                  className="w-[360px] border-none focus:outline-none focus-visible:border-none focus-visible:ring-primary-500"
                  placeholder={searchPlaceholder}
                  value={internalSearchValue}
                  onChange={(e) => setInternalSearchValue(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Toggle Button */}
              {enableFilters && filterConfigs.length > 0 && (
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0 text-primary-500"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SolarIconSet.Filter size={20} />
                  <Text>{showFilters ? 'hide filters' : 'show filters'}</Text>
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Filter Controls */}
          {showFilters && enableFilters && (
            <>
              <div className="px-4 pb-4">
                <div className="flex items-end gap-4">
                  {filterConfigs.map((config: any) => (
                    <FilterSelect
                      key={config.key}
                      config={config}
                      value={tempFilters[config.key]}
                      onChange={(value) => handleFilterChange(config.key, value)}
                    />
                  ))}

                  <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={applyFilters}>
                    Apply
                  </Button>
                </div>
              </div>

              {/* Active Filter Pills */}
              {hasActiveFilters && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-4">
                    {Object.entries(appliedInternalFilters).map(([key, value]) => {
                      if (value === undefined || value === null || value === '') return null
                      const config = filterConfigs.find((c) => c.key === key)
                      return (
                        <FilterPill
                          key={key}
                          label={config?.label || key}
                          value={value}
                          onRemove={() => removeSingleFilter(key)}
                        />
                      )
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700"
                      onClick={clearFilters}
                    >
                      <SolarIconSet.TrashBinMinimalistic size={16} />
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-md border border-neutral-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn('flex items-center', header.column.getCanSort() && 'cursor-pointer select-none')}
                        onClick={() => {
                          if (header.column.getCanSort()) {
                            handleSort(header.column.id)
                          }
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {enableSorting && header.column.getCanSort() && (
                          <div className="ml-2 flex flex-col">
                            {sorting?.sortBy === header.column.id && sorting?.direction === 'ASC' && (
                              <SolarIconSet.AltArrowUp size={16} className="text-primary-500" />
                            )}
                            {sorting?.sortBy === header.column.id && sorting?.direction === 'DESC' && (
                              <SolarIconSet.AltArrowDown size={16} className="text-primary-500" />
                            )}
                            {sorting?.sortBy !== header.column.id && (
                              <SolarIconSet.AltArrowUp size={16} className="text-neutral-300" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-neutral-50')}
                  onClick={() => onRowClick?.(row.original)}
                >
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
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Text size="sm" className="text-neutral-600">
              Showing{' '}
              {Math.min((paginationData.currentPage - 1) * paginationData.pageSize + 1, paginationData.totalElements)}{' '}
              to {Math.min(paginationData.currentPage * paginationData.pageSize, paginationData.totalElements)} of{' '}
              {paginationData.totalElements} results
            </Text>
          </div>

          <div className="flex items-center gap-2">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <Text size="sm" className="text-neutral-600">
                Rows per page:
              </Text>
              <Select
                value={paginationData.pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={paginationData.currentPage === 1}
              >
                <SolarIconSet.DoubleAltArrowLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(paginationData.currentPage - 1)}
                disabled={paginationData.currentPage === 1}
              >
                <SolarIconSet.AltArrowLeft size={16} />
              </Button>

              {/* Page input */}
              <div className="flex items-center gap-2">
                <Text size="sm" className="text-neutral-600">
                  Page
                </Text>
                <input
                  type="number"
                  value={currentPageInput}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageInputSubmit}
                  onBlur={handlePageInputBlur}
                  min="1"
                  max={paginationData.totalPages}
                  className="w-16 rounded border border-neutral-200 px-2 py-1 text-center text-sm"
                />
                <Text size="sm" className="text-neutral-600">
                  of {paginationData.totalPages}
                </Text>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(paginationData.currentPage + 1)}
                disabled={paginationData.currentPage === paginationData.totalPages}
              >
                <SolarIconSet.AltArrowRight size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(paginationData.totalPages)}
                disabled={paginationData.currentPage === paginationData.totalPages}
              >
                <SolarIconSet.DoubleAltArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
