import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './action-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'firstName', // Use accessorKey instead of accessorFn for simple cases
    header: 'First Name',
    cell: ({ row }) => <Text weight="light">{row.original.firstName ?? '—'}</Text>,
  },
  {
    accessorKey: 'lastName', // Simplified this one too
    header: 'Last Name',
    cell: ({ row }) => <Text weight="light">{row.original.lastName ?? '—'}</Text>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Text weight="light">{row.original.email ?? '—'}</Text>,
  },
  {
    accessorKey: 'phone',
    header: 'Phone number',
    cell: ({ row }) => <Text weight="light">{row.original.phone ?? '—'}</Text>,
  },
  {
    accessorKey: 'role', // Changed from 'roles' to 'role' to match your data structure
    header: 'Role/Permission',
    cell: ({ row }) => <Text weight="light">{row.original.roles ?? '—'}</Text>,
  },
  {
    accessorFn: (row) => row.original.status,
    header: 'Status',
    cell: ({ row }) => {
      const status = !row.original.accountNonLocked ? 'Active' : 'Inactive'
      return (
        <div
          className={`flex max-w-fit items-center gap-2 rounded-sm border px-2 py-1 text-sm capitalize ${
            status == 'Active'
              ? 'border-success-400 bg-success-100 text-success-500'
              : 'border-neutral-400 bg-neutral-100 text-neutral-400'
          }`}
        >
          {' '}
          <div
            className={`h-2 w-2 rounded-full ${status == 'Active' ? 'bg-success-400' : 'bg-neutral-400'}`}
          ></div>{' '}
          {status == 'Active' ? 'Active' : 'Deactived '}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row?.original} />,
  },
]
