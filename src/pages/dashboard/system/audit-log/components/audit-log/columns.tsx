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
    accessorKey: 'entityID',
    header: 'Entity ID',
    cell: ({ row }) => <Text weight="light">{row.original.entityId}</Text>,
  },
  {
    accessorKey: 'userEmail',
    header: 'User Email',
    cell: ({ row }) => <Text weight="light">{row.original.username}</Text>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description}</Text>,
  },
  {
    accessorKey: '	IP Address',
    header: '	IP Address',
    cell: ({ row }) => <Text weight="light">{row.original.ipAddress}</Text>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown audit={row?.original} />,
  },
]
