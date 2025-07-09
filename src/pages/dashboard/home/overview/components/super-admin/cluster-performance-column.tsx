import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { SuperAdminStatusBadge } from './super-admin-status-badge'

export const clusterPerformanceColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'clusterName',
    header: 'CLuster',
    cell: ({ row }) => <Text weight="light">{row?.original?.clusterName}</Text>,
  },
  {
    accessorKey: 'activeFarmerCount',
    header: 'Farmers',
    cell: ({ row }) => <Text weight="light">{row?.original?.activeFarmerCount}</Text>,
  },
  {
    accessorKey: 'totalHarvest',
    header: 'Harvested (kg)',
    cell: ({ row }) => <Text weight="light">{row?.original?.totalHarvest}</Text>,
  },
  {
    accessorKey: 'mortalityPercent',
    header: 'Mortality %',
    cell: ({ row }) => <Text weight="light">{row?.original?.mortalityPercent}</Text>,
  },
  {
    accessorKey: 'dataSubmissionPercent',
    header: 'Data Submission %',
    cell: ({ row }) => <Text weight="light">{row?.original?.dataSubmissionPercent}</Text>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <SuperAdminStatusBadge status={row?.original?.status?.toLowerCase()} />
    },
  },
]
