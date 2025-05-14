import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ReportActionsDropdown } from '../../../components/actions-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
  },
  {
    accessorKey: 'time',
    header: 'time',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
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
    accessorKey: 'feedQuantity',
    header: 'Quantity (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.feedQuantity}</Text>,
  },
  {
    accessorKey: 'dissolveOxygen',
    header: 'Diss. oxygen',
    cell: ({ row }) => <Text weight="light">{row.original.dissolveOxygen}</Text>,
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
    accessorKey: 'nitrite',
    header: 'Nitrate',
    cell: ({ row }) => <Text weight="light">{row.original.nitrite}</Text>,
  },
  {
    accessorKey: 'nitrate',
    header: 'Nitrate',
    cell: ({ row }) => <Text weight="light">{row.original.feedType}</Text>,
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
