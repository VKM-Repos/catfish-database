import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './action-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'pondName',
    header: 'Pond Name',
    cell: ({ row }) => <Text weight="light">{row.original.pondName}</Text>,
  },
  {
    accessorKey: 'fishQuantity',
    header: 'Fish Quantity',
    cell: ({ row }) => <Text weight="light">{row.original.fishQuantity}</Text>,
  },
  {
    accessorKey: 'weight',
    header: 'Average weight',
    cell: ({ row }) => <Text weight="light">{row.original.weight}</Text>,
  },
  {
    accessorKey: 'lastSampled',
    header: 'Last Sampled',
    cell: ({ row }) => <Text weight="light">{row.original.lastSampled}</Text>,
  },
  {
    accessorKey: 'pondStatus',
    header: 'Pond Status',
    cell: ({ row }) => (
      <div
        className={`flex max-w-fit items-center gap-2 rounded-sm border px-2 py-1 text-sm capitalize ${
          row.getValue('pondStatus') == true
            ? 'border-success-400 bg-success-100 text-success-500'
            : 'border-neutral-400 bg-neutral-100 text-neutral-400'
        }`}
      >
        {' '}
        <div
          className={`h-2 w-2 rounded-full ${row.getValue('pondStatus') == true ? 'bg-success-500' : 'bg-neutral-400'}`}
        ></div>{' '}
        {row.getValue('pondStatus') == true ? 'Active' : 'Deactivated'}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown pond={row.original} />,
  },
]
