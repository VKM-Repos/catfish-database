import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedInventoryActions } from './actions'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'type',
    header: 'Feed type',
    cell: ({ row }) => (
      <Text className="capitalize" weight="light">
        {row.original.type.toLowerCase() || '-'}
      </Text>
    ),
  },
  {
    accessorKey: 'sizeInMm',
    header: 'Size (mm)',
    cell: ({ row }) => <Text weight="light">{row.original.sizeInMm || '-'}</Text>,
  },
  // {
  //   accessorKey: 'quantityInKg',
  //   header: 'Total feed stocked (kg)',
  //   cell: ({ row }) => <Text weight="light">{row.original.quantityInKg || '-'}</Text>,
  // },
  {
    accessorKey: 'costPerKg',
    header: 'Avg Cost/ kg(₦)',
    cell: ({ row }) => {
      const cost = row.original.costPerKg
      return <Text weight="light">{cost ? `₦${Math.round(cost)}` : '-'}</Text>
    },
  },
  // {
  //   accessorKey: 'cost',
  //   header: 'Total cost (₦)',
  //   cell: ({ row }) => <Text weight="light">{`₦${row.original.costPerKg * row.original.quantityInKg}` || '-'}</Text>,
  // },
  {
    accessorKey: 'quantityInKg',
    header: 'Remaining stock',
    cell: ({ row }) => <Text weight="light">{row.original.quantityInKg ?? '-'}</Text>,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ row }) => (
      <>
        <Text weight="light">{formatDate(row.original.updatedAt)}</Text>
        <Text weight="light">{extractTimeFromISO(row.original.updatedAt)}</Text>
      </>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <FeedInventoryActions item={row?.original} />,
  },
]
