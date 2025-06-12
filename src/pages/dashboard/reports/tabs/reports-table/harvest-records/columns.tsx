import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { HarvestReportActionsDropdown } from './actions-dropdown'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'quantity',
    header: () => (
      <div title="Quantity" className="w-[4rem] truncate font-bold">
        Quantity
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.quantity}</Text>,
  },
  {
    accessorKey: 'totalWeightHarvested',
    header: () => (
      <div title="Total weight harvested" className="w-[4rem] truncate font-bold">
        Total weight harvested
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.totalWeightHarvested}</Text>,
  },
  {
    accessorKey: 'costPerKg',
    header: () => (
      <div title="Cost per kg" className="font-bold">
        Cost per kg
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.costPerKg}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <HarvestReportActionsDropdown samplingData={row?.original} />,
  },
]
