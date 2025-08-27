import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'time',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.time)}</Text>,
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => <Text weight="light">{extractTimeFromISO(row.original.time)}</Text>,
  },
  {
    accessorKey: 'batch.pond.name',
    header: 'Pond',
    cell: ({ row }) => <Text weight="light">{row.original.batch.pond.name || '-'}</Text>,
  },
  {
    accessorKey: 'feedType',
    header: 'Feed Type',
    cell: ({ row }) => <Text weight="light">{row.original.feedType || '-'}</Text>,
  },
  {
    accessorKey: 'pelletSize',
    header: 'Pellet size',
    cell: ({ row }) => <Text weight="light">{row.original.pelletSize || '-'}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.quantity || '-'}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown report={row?.original} step="1" />,
  },
]
