import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { clusterManagerResponseSchema } from 'src/schemas/schemas'
import { StatusBadge } from 'src/components/global/status-badge'
import { cn } from 'src/lib/utils'

type ClusterManager = z.infer<typeof clusterManagerResponseSchema>

export const columns: ColumnDef<ClusterManager>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => <Text weight="light">{row.original.firstName}</Text>,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => <Text weight="light">{row.original.lastName}</Text>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Text weight="light">{row.original.email}</Text>,
  },
  {
    accessorKey: 'phone',
    header: 'Phone number',
    cell: ({ row }) => <Text weight="light">{row.original.phone}</Text>,
  },
  {
    accessorKey: 'cluster',
    header: 'Cluster',
    cell: ({ row }) => <Text weight="light">{row.original.cluster?.name}</Text>,
  },
  {
    accessorKey: 'accountNonLocked',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue('accountNonLocked')}
        activeText="Active"
        inactiveText="Deactivated"
        size="sm"
        inactiveConfig={{
          textColor: 'text-[#737780]',
          borderColor: 'border-[#737780]',
          backgroundColor: 'bg-[#737780]/10',
          dotColor: 'bg-[#737780]',
        }}
        inactiveIcon={
          <div
            className={cn('h-2 w-2 rounded-full', row.getValue('accountNonLocked') ? 'bg-success-400' : 'bg-[#737780]')}
          />
        }
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  },
]
