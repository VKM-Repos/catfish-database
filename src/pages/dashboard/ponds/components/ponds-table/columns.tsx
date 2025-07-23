import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './action-dropdown'
import { StatusBadge } from 'src/components/global/status-badge'
import { formatNumberWithCommas } from 'src/lib/utils'

export interface PondData {
  id: string
  name: string
  size: number
  waterSource: string
  pondType: string
  cluster: {
    id: string
    name: string
  }
  farmer: {
    id: string
    name: string
  }
  status: 'Active' | 'Inactive'
  quantity?: number
  weight?: string
  lastSampled?: string
  totalFishBatches?: number
  totalCostOfSupply?: number
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<PondData>[] = [
  {
    id: 'initials',
    header: 'Avatar',
    cell: ({ row }) => {
      const initials = row.original.name
        ?.split(' ')
        .filter(Boolean)
        .map((word: string) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      return (
        <div className="flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded bg-neutral-100 p-1 text-xs font-semibold text-neutral-600">
          {initials}
        </div>
      )
    },
  },
  {
    header: 'Pond Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const pond = row.original
      return (
        <div className="flex flex-col">
          <Text weight="light">{pond.name ?? '—'}</Text>
          <Text size="sm" className="text-neutral-500">
            {pond.cluster.name}
          </Text>
        </div>
      )
    },
  },
  {
    accessorKey: 'latestQuantity',
    header: 'Fish Quantity',
    cell: ({ row }) => {
      const quantity = row.original.quantity
      return (
        <div className="flex flex-col">
          <Text weight="light">{quantity != null ? `${formatNumberWithCommas(quantity)}` : '—'}</Text>
          {row.original.totalFishBatches != null && (
            <Text size="sm" className="text-neutral-500">
              {row.original.totalFishBatches} batch{row.original.totalFishBatches !== 1 ? 'es' : ''}
            </Text>
          )}
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'lastSampled',
  //   header: 'Last Sampled',
  //   cell: ({ row }) => <Text weight="light">{row.original.lastSampled ?? '—'}</Text>,
  // },
  {
    accessorKey: 'size',
    header: 'Pond Size',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Text weight="light">{formatNumberWithCommas(row.original.size)}L</Text>
        <Text size="sm" className="text-neutral-500">
          {row.original.pondType}
        </Text>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <StatusBadge
          status={status === 'Active'}
          activeText="Active"
          inactiveText="Inactive"
          size="sm"
          inactiveConfig={{
            textColor: 'text-[#737780]',
            borderColor: 'border-[#737780]',
            backgroundColor: 'bg-[#737780]/10',
            dotColor: 'bg-[#737780]',
          }}
        />
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsDropdown pond={row.original} />,
  },
]
