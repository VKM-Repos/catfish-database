import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <Text weight="light" className="text-xs">
        {row.original.date}
      </Text>
    ),
  },
  {
    accessorKey: 'activityType',
    header: 'Activity',
    cell: ({ row }) => (
      <Text weight="light" className="text-xs">
        {row.original.activityType}
      </Text>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <Text weight="light" className="text-xs">
        {row.original.description}
      </Text>
    ),
  },
]
