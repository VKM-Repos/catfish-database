import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const mortalityColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'time',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original?.time)}</Text>,
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
    accessorKey: 'mortalityNumber',
    header: 'Mortality number',
    cell: ({ row }) => <Text weight="light">{row.original?.mortalityNumber ?? '-'}</Text>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown report={row?.original} step="5" />,
  },
]
