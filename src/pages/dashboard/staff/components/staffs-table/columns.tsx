import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './action-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    header: 'First Name',
    accessorFn: (row) => row.original.name ?? '—',
    cell: ({ row }) => {
      const pond = row.original

      return <Text weight="light">{pond.name ?? '—'}</Text>
    },
  },
  {
    header: 'Last Name',
    accessorFn: (row) => row.original.name ?? '—',
    cell: ({ row }) => {
      const pond = row.original

      return <Text weight="light">{pond.name ?? '—'}</Text>
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Text weight="light">{row.original.latestQuantity ?? '—'}</Text>,
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone number',
    cell: ({ row }) => <Text weight="light">{row.original.weight ?? '—'}</Text>,
  },
  {
    // accessorKey: 'lastSampled',
    header: 'Role/Permission',
    cell: ({ row }) => <Text weight="light">{row.original.lastSampled ?? '—'}</Text>,
  },
  {
    accessorFn: (row) => row.original.status,
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.latestQuantity === 0 ? 'Inactive' : 'Active'
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
          {status}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row?.original} />,
  },
]
