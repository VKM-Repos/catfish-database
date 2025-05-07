import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
  },
  {
    accessorKey: 'feedType',
    header: 'Feed Type',
    cell: ({ row }) => <Text weight="light">{row.original.feedType}</Text>,
  },
  {
    accessorKey: 'quantityType',
    header: 'Quantity type(kg)',
    cell: ({ row }) => <Text weight="light">{row.original.quantityType}</Text>,
  },
  {
    accessorKey: 'feedingTime',
    header: 'Feeding time(s)',
    cell: ({ row }) => <Text weight="light">{row.original.feedingTime}</Text>,
  },
]
