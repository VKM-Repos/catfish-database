import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ReportActionsDropdown } from '../../../components/actions-dropdown'
import { extractTimeFromISO, formatDate } from 'src/lib/date'

export const waterQualityColumns: ColumnDef<any>[] = [
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
    accessorKey: 'dissolveOxygen',
    header: 'Diss. oxygen',
    cell: ({ row }) => <Text weight="light">{row.original.dissolvedOxygen}</Text>,
  },
  {
    accessorKey: 'phLevel',
    header: 'pH',
    cell: ({ row }) => <Text weight="light">{row.original.phLevel}</Text>,
  },
  {
    accessorKey: 'temperature',
    header: 'Temp.',
    cell: ({ row }) => <Text weight="light">{row.original.temperature}</Text>,
  },
  {
    accessorKey: 'ammonia',
    header: 'Ammonia',
    cell: ({ row }) => <Text weight="light">{row.original.ammonia}</Text>,
  },
  {
    accessorKey: 'nitrate',
    header: 'Nitrate',
    cell: ({ row }) => <Text weight="light">{row.original.nitrate}</Text>,
  },
  {
    accessorKey: 'nitrite',
    header: 'Nitrite',
    cell: ({ row }) => <Text weight="light">{row.original.nitrite}</Text>,
  },
  {
    accessorKey: 'alkalinity',
    header: 'Alkalinity',
    cell: ({ row }) => <Text weight="light">{row.original.nitrate}</Text>,
  },
  {
    accessorKey: 'hardness',
    header: 'Hardness',
    cell: ({ row }) => <Text weight="light">{row.original.hardness}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ReportActionsDropdown user={row?.original} />,
  },
]
