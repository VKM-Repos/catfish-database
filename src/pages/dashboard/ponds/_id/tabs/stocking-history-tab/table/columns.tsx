import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => <Text weight="light">{row.original.quantity}</Text>,
  },
  {
    accessorKey: 'averageWeight',
    header: 'Average weight',
    cell: ({ row }) => <Text weight="light">{row.original.averageWeight}</Text>,
  },
  {
    accessorKey: 'averageSize',
    header: 'Average Size',
    cell: ({ row }) => <Text weight="light">{row.original.averageSize}</Text>,
  },
  {
    accessorKey: 'supplyCost',
    header: 'Supply Cost',
    cell: ({ row }) => <Text weight="light">{row.original.supplyCost}</Text>,
  },
]
