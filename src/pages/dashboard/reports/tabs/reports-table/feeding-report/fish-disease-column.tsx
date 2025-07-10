import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const fishDiseaseColumn: ColumnDef<any>[] = [
  {
    accessorKey: 'time',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original?.time)}</Text>,
  },
  {
    accessorKey: 'diseaseType',
    header: 'Disease Type',
    cell: ({ row }) => <Text weight="light">{row.original?.diseaseType ?? '-'}</Text>,
  },
  {
    accessorKey: 'diseaseObservation',
    header: 'Observation',
    cell: ({ row }) => <Text weight="light">{row.original?.diseaseObservation ?? '-'}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown user={row?.original} />,
  },
]
