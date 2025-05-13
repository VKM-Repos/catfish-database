import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.date)}</Text>,
  },
  {
    accessorKey: 'feedType',
    header: 'Feed Type',
    cell: ({ row }) => (
      <Text weight="light">{row.original.feedType?.charAt(0).toUpperCase() + row.original.feedType.slice(1)}</Text>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity type(kg)',
    cell: ({ row }) => <Text weight="light">{row.original.quantityType}</Text>,
  },
  {
    accessorKey: 'frequency',
    header: 'Feeding times',
    cell: ({ row }) => <Text weight="light">{row.original.frequency}</Text>,
  },
]
