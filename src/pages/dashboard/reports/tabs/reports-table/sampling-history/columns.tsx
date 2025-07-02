import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { SamplingReportActionsDropdown } from './actions-dropdown'
import { StatusBadge } from 'src/components/global/status-badge'
import { getInitials } from 'src/lib/utils'
import * as SolarIconSet from 'solar-icon-set'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'sample',
    header: () => (
      <div title="No. fish sampled" className="w-[4rem] truncate font-semibold">
        No. fish sampled
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.sample}</Text>,
  },
  {
    accessorKey: 'weight',
    header: () => (
      <div title="Wgt fish sampled" className="w-[4rem] truncate font-semibold">
        Wgt fish sampled
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.weight}</Text>,
  },
  {
    accessorKey: 'averageWeightToFish',
    header: () => (
      <div title="Average weight" className="font-semibold">
        Avg. wgt
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.averageWeightToFish}</Text>,
  },
  {
    accessorKey: 'weightGain',
    header: () => (
      <div title="Total wgt gain" className="w-[4rem] truncate font-semibold">
        Total wgt gain
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.weightGain}</Text>,
  },
  {
    accessorKey: 'feedConsumed',
    header: 'Feed consumed',
    cell: ({ row }) => <Text weight="light">{row.original.feedConsumed}</Text>,
  },
  {
    accessorKey: 'mortality',
    header: 'Mort',
    cell: ({ row }) => <Text weight="light">{row.original.mortality}</Text>,
  },
  {
    accessorKey: 'splitOccur',
    header: () => (
      <div title="Split triggered" className="w-[4rem] truncate font-bold">
        Split triggered
      </div>
    ),
    cell: ({ row }) => {
      const status = !(row.original.harvest === null && row.original.destinationBatches.length < 1)
      return (
        <StatusBadge
          status={status}
          activeText="Yes"
          inactiveText="No"
          size="sm"
          inactiveConfig={{
            textColor: 'text-[#FF0000]',
            borderColor: 'border-[#FF0000]',
            backgroundColor: 'bg-error-100',
            dotColor: 'bg-error-800',
          }}
        />
      )
    },
  },
  {
    accessorKey: 'destinationBatches',
    header: () => (
      <div title="Dest. pond" className="w-[4rem] truncate font-bold">
        Dest. pond
      </div>
    ),
    cell: ({ row }) => {
      const batches = row.original.destinationBatches || []

      return (
        <div className="flex gap-1">
          {batches.slice(0, 2).map((dest: any) => (
            <span
              className="rounded-md border-2 border-neutral-300 bg-neutral-200 px-1 py-1 font-semibold"
              key={dest?.id}
            >
              {getInitials(dest.pond.name)}
            </span>
          ))}
          {batches.length > 2 && (
            <span className="rounded-md border-2 border-neutral-300 bg-neutral-200 px-1 py-1 font-semibold">
              +{batches.length - 2}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: () => (
      <div title="Reason" className="w-[4rem] truncate font-bold">
        Reason
      </div>
    ),
    cell: ({ row }) => {
      const reasonBool = row.original.harvest !== null

      return (
        <>
          {row.original.destinationBatches.length > 0 || row.original.harvest !== null ? (
            <StatusBadge
              status={reasonBool}
              activeText="Harvest"
              inactiveText="Transfer"
              activeIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />}
              inactiveIcon={<SolarIconSet.MapArrowRight color="currentColor" size={16} />}
              size="sm"
              inactiveConfig={{
                textColor: 'text-[#000AFF]',
                borderColor: 'border-[#000AFF]',
                backgroundColor: 'bg-[#E5E7FF]',
                dotColor: 'bg-[#000AFF]',
              }}
            />
          ) : (
            ''
          )}
        </>
      )
    },
  },

  // {
  //   accessorKey: 'fishMoved',
  //   header: () => (
  //     <div title="Number of fish moved" className="w-[4rem] truncate font-semibold">
  //       No. of fish moved
  //     </div>
  //   ),
  //   cell: ({ row }) => <Text weight="light">{row.original.fishMoved}</Text>,
  // },
  // {
  //   accessorKey: 'destinationPond',
  //   header: () => (
  //     <div title="Destination pond" className=" font-semibold">
  //       Dest. pond
  //     </div>
  //   ),
  //   cell: ({ row }) => <Text weight="light">{row.original.destinationPond}</Text>,
  // },
  // },
  {
    id: 'actions',
    cell: ({ row }) => <SamplingReportActionsDropdown samplingData={row?.original} />,
  },
]
