import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import ActionsDropdown from './actions-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  // {
  //   accessorKey: 'source',
  //   header: 'Source',
  //   cell: ({ row }) => <Text weight="light">{row.original.source ?? '—'}</Text>,
  // },
  // {
  //   accessorKey: 'batchName',
  //   header: 'Batch',
  //   cell: ({ row }) => <Text weight="light">{row.original.batchName ?? '—'}</Text>,
  // },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => <Text weight="light">{row.original.quantity ?? '—'}</Text>,
  },
  // {
  //   accessorKey: 'weight',
  //   header: 'Average weight',
  //   cell: ({ row }) => <Text weight="light">{row.original.weight ?? '—'}</Text>,
  // },
  // {
  //   accessorKey: 'size',
  //   header: 'Fish Size',
  //   cell: ({ row }) => <Text weight="light">{row.original.size ?? '—'}</Text>,
  // },
  // {
  //   accessorKey: 'description',
  //   header: 'Fish description',
  //   cell: ({ row }) => <Text weight="light">{row.original.description ?? '—'}</Text>,
  // },
  {
    accessorKey: 'costOfSupply',
    header: 'Supply Cost',
    cell: ({ row }) => <Text weight="light">₦{row.original.costOfSupply ?? '-'}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown batch={row.original} />,
  },
]
