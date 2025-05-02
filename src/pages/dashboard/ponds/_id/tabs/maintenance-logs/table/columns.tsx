import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
  },
  {
    accessorKey: 'activityType',
    header: 'Activity Type',
    cell: ({ row }) => <Text weight="light">{row.original.activityType}</Text>,
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => <Text weight="light">{row.original.cost}</Text>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description}</Text>,
  },
]
