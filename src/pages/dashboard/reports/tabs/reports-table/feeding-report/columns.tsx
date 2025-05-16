import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ReportActionsDropdown } from '../../../components/actions-dropdown'
import { extractTimeFromISO, formatDate } from 'src/lib/date'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'time',
    header: 'time',
    cell: ({ row }) => <Text weight="light">{extractTimeFromISO(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'feedType',
    header: 'feed Type',
    cell: ({ row }) => <Text weight="light">{row.original.feedType}</Text>,
  },
  {
    accessorKey: 'pelletSize',
    header: 'Pellet size',
    cell: ({ row }) => <Text weight="light">{row.original.pelletSize}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.quantity}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ReportActionsDropdown user={row?.original} />,
  },
]
