import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { clusterManagerResponseSchema } from 'src/schemas/schemas'

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
      <div
        className={`flex items-center gap-2 rounded-sm border px-2 py-1 text-sm capitalize ${
          row.getValue('accountNonLocked') == true
            ? 'border-success-400 bg-success-100 text-success-500'
            : 'border-neutral-400 bg-neutral-100 text-neutral-400'
        }`}
      >
        {' '}
        <div
          className={`h-2 w-2 rounded-full ${
            row.getValue('accountNonLocked') == true ? 'bg-success-500' : 'bg-neutral-400'
          }`}
        ></div>{' '}
        {row.getValue('accountNonLocked') == true ? 'Active' : 'Deactivated'}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  },
]
