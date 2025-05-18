import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => <Text weight="light">{extractTimeFromISO(row.original.createdAt)}</Text>,
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
    accessorKey: 'dissolvedOxygen',
    header: 'Diss. Oxygen',
    cell: ({ row }) => <Text weight="light">{row.original.dissolvedOxygen ?? '-'}</Text>,
  },
  {
    accessorKey: 'phLevel',
    header: 'pH',
    cell: ({ row }) => <Text weight="light">{row.original.phLevel ?? '-'}</Text>,
  },
  {
    accessorKey: 'temperature',
    header: 'Temp',
    cell: ({ row }) => <Text weight="light">{row.original.temperature ?? '-'}</Text>,
  },
  {
    accessorKey: 'ammonia',
    header: 'Ammonia',
    cell: ({ row }) => <Text weight="light">{row.original.ammonia ?? '-'}</Text>,
  },
  {
    accessorKey: 'nitrate',
    header: 'Nitrate',
    cell: ({ row }) => <Text weight="light">{row.original.nitrate ?? '-'}</Text>,
  },
  {
    accessorKey: 'alkalinity',
    header: 'Alkalinity',
    cell: ({ row }) => <Text weight="light">{row.original.alkalinity ?? '-'}</Text>,
  },
  {
    accessorKey: 'hardness',
    header: 'Hardness',
    cell: ({ row }) => <Text weight="light">{row.original.hardness ?? '-'}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown user={row?.original} />,
  },
]
