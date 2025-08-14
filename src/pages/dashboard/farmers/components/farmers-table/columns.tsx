import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { userSchema } from 'src/schemas/schemas'
import { StatusBadge } from 'src/components/global/status-badge'
import { cn } from 'src/lib/utils'

type Farmer = z.infer<typeof userSchema>

export const columns: ColumnDef<Farmer>[] = [
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
    accessorKey: 'enabled',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue('enabled')}
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
          <div className={cn('h-2 w-2 rounded-full', row.getValue('enabled') ? 'bg-success-400' : 'bg-[#737780]')} />
        }
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row?.original} />,
  },
]
