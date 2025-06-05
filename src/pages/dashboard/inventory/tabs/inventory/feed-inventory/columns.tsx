import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO } from 'src/lib/date'
import { FeedInventoryActions } from './actions'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'type',
    header: 'Feed type',
    cell: ({ row }) => <Text weight="light">{row.original.type || '-'}</Text>,
  },
  {
    accessorKey: 'sizeInMm',
    header: 'Size (mm)',
    cell: ({ row }) => <Text weight="light">{row.original.sizeInMm || '-'}</Text>,
  },
  {
    accessorKey: 'costPerKg',
    header: 'Avg Cost/ kg(₦)',
    cell: ({ row }) => <Text weight="light">{`₦${row.original.costPerKg}` || '-'}</Text>,
  },
  {
    accessorKey: 'feedStock',
    header: 'Total feed stocked (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.feedStock || '-'}</Text>,
  },
  {
    accessorKey: 'cost',
    header: 'Total cost (₦)',
    cell: ({ row }) => <Text weight="light">{`₦${row.original.cost}` || '-'}</Text>,
  },
  {
    accessorKey: 'stock',
    header: 'Remaining stock',
    cell: ({ row }) => <Text weight="light">{row.original.stock ?? '-'}</Text>,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ row }) => <Text weight="light">{extractTimeFromISO(row.original.updatedAt)}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <FeedInventoryActions item={row?.original} />,
  },
]
