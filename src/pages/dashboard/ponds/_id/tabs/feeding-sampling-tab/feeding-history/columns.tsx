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
    accessorKey: 'feedType',
    header: 'Feed Type',
    cell: ({ row }) => (
      <Text weight="light">
        {row.original.feedType?.charAt(0).toUpperCase() + row.original.feedType.slice(1).toLowerCase()}
      </Text>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity type(kg)',
    cell: ({ row }) => <Text weight="light">{row.original.quantity ?? ''}</Text>,
  },
  {
    accessorKey: 'frequency',
    header: 'Feeding times',
    cell: ({ row }) => (
      <Text weight="light">
        {row.original.frequency?.charAt(0).toUpperCase() + row.original.frequency.slice(1).toLowerCase()}
      </Text>
    ),
  },
]
