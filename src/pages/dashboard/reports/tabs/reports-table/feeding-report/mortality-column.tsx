import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const mortalityColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'time',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original?.time)}</Text>,
  },
  {
    accessorKey: 'mortalityNumber',
    header: 'Mortality number',
    cell: ({ row }) => <Text weight="light">{row.original?.mortalityNumber ?? '-'}</Text>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown user={row?.original} />,
  },
]
