import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'

export const columns: ColumnDef<any>[] = [
  {
    id: 'initials',
    header: 'Avatar',
    cell: ({ row }) => {
      const initials = row.original.name
        ?.split(' ')
        .filter(Boolean)
        .map((word: string) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      return (
        <div className="flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded bg-neutral-100 p-1 text-xs font-semibold text-neutral-600">
          {initials}
        </div>
      )
    },
  },
  {
    header: 'Pond Name',
    accessorFn: (row) => row.original.name ?? '—',
    cell: ({ row }) => {
      const pond = row.original

      return <Text weight="light">{pond.name ?? '—'}</Text>
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Fish Quantity',
    cell: ({ row }) => <Text weight="light">{row.original.quantity ?? '—'}</Text>,
  },
  {
    accessorKey: 'weight',
    header: 'Average weight',
    cell: ({ row }) => <Text weight="light">{row.original.weight ?? '—'}</Text>,
  },
  {
    accessorKey: 'lastSampled',
    header: 'Last Sampled',
    cell: ({ row }) => <Text weight="light">{row.original.lastSampled ?? '—'}</Text>,
  },
  {
    accessorFn: (row) => row.original.status ?? (row.original.quantity == 0 ? 'Inactive' : 'Inactive'),
    header: 'Pond Status',
    cell: ({ row }) => {
      const status = row.original.quantity == 0 ? 'Inactive' : 'Active'
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
]
