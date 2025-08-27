import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { auditSchema } from 'src/schemas/auditLogSchema'

type audit = z.infer<typeof auditSchema>

export const columns: ColumnDef<audit>[] = [
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => <Text weight="light">{new Date(row.original.timestamp).toLocaleString()}</Text>,
  },
  {
    accessorKey: 'actionType',
    header: 'Action Type',
    cell: ({ row }) => <Text weight="light">{row.original.actionType}</Text>,
  },
  {
    accessorKey: 'entityType',
    header: 'Entity Type',
    cell: ({ row }) => <Text weight="light">{row.original.entityType}</Text>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description}</Text>,
  },

  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ActionsDropdown audit={row?.original} />,
  },
]
