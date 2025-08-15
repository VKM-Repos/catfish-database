import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { SalesRecordsActions } from './actions'
import { formatPrice } from 'src/lib/utils'
import { formatDate } from 'src/lib/date'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt ?? '') || '-'}</Text>,
  },
  {
    accessorKey: 'pond',
    header: 'Pond name',
    cell: ({ row }) => <Text weight="light">{row?.original?.fishBatch?.pond?.name || '-'}</Text>,
  },
  {
    accessorKey: 'totalWeightHarvested',
    header: 'Total weight (kg)',
    cell: ({ row }) => <Text weight="light">{row?.original?.totalWeightHarvested ?? '-'}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: 'No. of fish sold',
    cell: ({ row }) => <Text weight="light">{row?.original?.quantity ?? 0}</Text>,
  },
  {
    accessorKey: 'costPerKg',
    header: 'Cost price per kg (₦)',
    cell: ({ row }) => (
      <Text weight="light">{row?.original?.costPerKg < 1 ? '-' : formatPrice(row?.original?.costPerKg)}</Text>
    ),
  },
  {
    accessorKey: 'costPerFish',
    header: 'Cost per fish (₦)',
    cell: ({ row }) => (
      <Text weight="light">{row?.original?.costPerFish < 1 ? '-' : formatPrice(row?.original?.costPerFish)}</Text>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <SalesRecordsActions item={row?.original} />,
  },
]
