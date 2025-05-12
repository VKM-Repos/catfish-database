import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => <Text weight="light">{row.original.quantity ?? '—'}</Text>,
  },
  {
    accessorKey: 'weight',
    header: 'Average weight',
    cell: ({ row }) => <Text weight="light">{row.original.weight ?? '—'}</Text>,
  },
  {
    accessorKey: 'size',
    header: 'Average Size',
    cell: ({ row }) => <Text weight="light">{row.original.size ?? '—'}</Text>,
  },
  {
    accessorKey: 'costOfSupply',
    header: 'Supply Cost',
    cell: ({ row }) => <Text weight="light">₦{row.original.costOfSupply ?? '-'}</Text>,
  },
]
