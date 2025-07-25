import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const mortalityColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original?.createdAt)}</Text>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => <Text weight="light">{extractTimeFromISO(row.original.createdAt)}</Text>,
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
