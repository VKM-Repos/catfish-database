import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { SuperAdminStatusBadge } from './super-admin-status-badge'

export const clusterPerformanceColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'cluster',
    header: 'CLuster',
    cell: ({ row }) => <Text weight="light">{row.original.cluster}</Text>,
  },
  {
    accessorKey: 'farmers',
    header: 'Farmers',
    cell: ({ row }) => <Text weight="light">{row.original.farmers}</Text>,
  },
  {
    accessorKey: 'harvested',
    header: 'Harvested (kg)',
    cell: ({ row }) => <Text weight="light">{row.original.harvested}</Text>,
  },
  {
    accessorKey: 'mortality',
    header: 'Mortality %',
    cell: ({ row }) => <Text weight="light">{row.original.mortality}</Text>,
  },
  {
    accessorKey: 'submission',
    header: 'Data Submission %',
    cell: ({ row }) => <Text weight="light">{row.original.submission}</Text>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <SuperAdminStatusBadge status={row.original.status} />
    },
  },
]
