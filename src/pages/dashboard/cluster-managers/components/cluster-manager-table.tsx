'use client'

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
import { MoreHorizontal } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import * as SolarIconSet from 'solar-icon-set'
import { DeactivateDialog } from './deactivate-dialog'
import { ViewClusterManagerDialog } from './view-cluster-manager-dialog'
import { AddClusterManagerFormDialog } from './add-cluster-manager-form-dialog'

const data: Cluster[] = [
  {
    id: 'm5gr84i9',
    first_name: 'Salis ',
    last_name: 'Sadiq',
    email: 'ken99@yahoo.com',
    phone_number: '1-123-456-7890',
    cluster: 'Cluster 1',
    status: 'Active',
  },
  {
    id: 'jdnkjndsabc',
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
    phone_number: '1-123-456-7890',
    cluster: 'Cluster 2',
    status: 'Deactivated',
  },
  {
    id: '1234556',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'janedoe@example.com',
    phone_number: '1-123-456-7890',
    cluster: 'Cluster 3',
    status: 'Active',
  },
  {
    id: '12345561',
    first_name: 'Morrison',
    last_name: 'John',
    email: 'morris@example.com',
    phone_number: '1-123-456-7890',
    cluster: 'Cluster 4',
    status: 'Deactivated',
  },
]

export type Cluster = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  cluster: string
  status: string
}

export const columns: ColumnDef<Cluster>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('first_name')}</div>,
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('last_name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className="capitalize">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
    cell: ({ row }) => <div className="capitalize">{row.getValue('phone_number')}</div>,
  },
  {
    accessorKey: 'cluster',
    header: 'Cluster',
    cell: ({ row }) => <div className="capitalize">{row.getValue('cluster')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div
        className={`flex items-center gap-2 rounded-sm border px-2 py-1 text-sm capitalize ${
          row.getValue('status') == 'Active'
            ? 'border-success-400 bg-success-100 text-success-500'
            : 'border-neutral-400 bg-neutral-100 text-neutral-400'
        }`}
      >
        {' '}
        <div
          className={`h-2 w-2 rounded-full ${row.getValue('status') == 'Active' ? 'bg-success-500' : 'bg-neutral-400'}`}
        ></div>{' '}
        {row.getValue('status')}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-primary-500 hover:text-white">
              <ViewClusterManagerDialog />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-primary-500 hover:text-white">
              <AddClusterManagerFormDialog
                icon={<SolarIconSet.PenNewRound />}
                buttonTitle="Edit"
                buttonVariant="ghost"
                buttonSize="xs"
                action="edit"
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-primary-500 hover:text-white">
              <DeactivateDialog />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ClusterManagerTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="rounded-lg bg-neutral-50">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
