import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { FeedingReportActionsDropdown } from './actions-dropdown'

export const fishBehaviorColumn: ColumnDef<any>[] = [
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
    accessorKey: 'behaviorType',
    header: 'Behavior Type',
    cell: ({ row }) => (
      <Text weight="light">
        {row.original?.behaviorType
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/^\w/, (firstChar: string) => firstChar.toUpperCase()) ?? '-'}
      </Text>
    ),
  },
  {
    accessorKey: 'behaviorTypeObservation',
    header: 'Observation',
    cell: ({ row }) => <Text weight="light">{row.original?.behaviorTypeObservation}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <FeedingReportActionsDropdown report={row?.original} step="3" />,
  },
]
