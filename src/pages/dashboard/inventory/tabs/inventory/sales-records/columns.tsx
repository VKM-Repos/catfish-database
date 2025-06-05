import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { MaintenanceExpenseActions } from './actions'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.updatedAt)}</Text>,
  },
  {
    accessorKey: 'name',
    header: 'Pond name',
    cell: ({ row }) => <Text weight="light">{row.original.name || '-'}</Text>,
  },
  {
    accessorKey: 'totalWeight',
    header: 'Total weight (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.totalWeight ?? '-'}</Text>,
  },
  {
    accessorKey: 'fishSold',
    header: 'No. of fish sold',
    cell: ({ row }) => <Text weight="light">{row.original.fishSold ?? '-'}</Text>,
  },
  {
    accessorKey: 'cost',
    header: 'Cost price per kg (₦)',
    cell: ({ row }) => <Text weight="light">{`₦${row.original.cost}` || '-'}</Text>,
  },
  {
    accessorKey: 'income',
    header: 'Total income (₦)',
    cell: ({ row }) => <Text weight="light">{`₦${row.original.income}` || '-'}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <MaintenanceExpenseActions item={row?.original} />,
  },
]
