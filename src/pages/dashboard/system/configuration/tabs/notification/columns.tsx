import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { formatPrice } from 'src/lib/utils'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.updatedAt)}</Text>,
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{formatPrice(row.original.cost) || '-'}</Text>,
  },
  {
    accessorKey: 'admin',
    header: 'Admin',
    cell: ({ row }) => <Text weight="light">{row.original.pond?.name ?? '-'}</Text>,
  },
  {
    accessorKey: 'manager',
    header: 'Manager',
    cell: ({ row }) => <Text weight="light">{row.original.pond?.name ?? '-'}</Text>,
  },
  {
    accessorKey: 'farmer',
    header: 'Farmer',
    cell: ({ row }) => <Text weight="light">{row.original.pond?.name ?? '-'}</Text>,
  },
  {
    accessorKey: 'freqency',
    header: 'Frequency',
    cell: ({ row }) => <Text weight="light">{row.original.pond?.name ?? '-'}</Text>,
  },
]
