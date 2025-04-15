import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyStateMessage?: string
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyStateMessage = 'No results found',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
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

  const renderSkeletonRows = (columns: ColumnDef<TData>[]) => {
    const skeletonRows = Array.from({ length: 5 }, (_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${index}-${colIndex}`} className="h-12">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))
    return skeletonRows
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex h-[80px] items-center justify-between rounded-md bg-neutral-50 px-[24px] py-[20px]">
        <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <SolarIconSet.MinimalisticMagnifer />
          <input
            className="w-[390px] border-none focus:outline-none focus-visible:border-none focus-visible:ring-primary-500"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
          />
        </div>
        <div />
      </div>

      <div className="overflow-hidden rounded-md border border-neutral-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="">
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
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-2">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
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

        {/* Page info */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          {/* Page navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="icon"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <SolarIconSet.AltArrowLeft size={20} />
            </Button>

            {/* Page numbers - shows up to 5 pages around current page */}
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              let pageIndex
              const currentPage = table.getState().pagination.pageIndex
              const pageCount = table.getPageCount()

              // Calculate which pages to show
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
            </div>
            <Button
              variant="icon"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <SolarIconSet.AltArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
