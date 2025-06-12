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
          inactiveBg="bg-error-100 border-[#FF0000] text-[#FF0000]"
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
              inactiveBg="bg-[#E5E7FF] text-[#000AFF] border-[#000AFF]"
            />
          ) : (
            ''
          )}
        </>
      )
    },
  },
  // {
  //   accessorKey: 'splitTriggered',
  //   header: () => (
  //     <div title="Split triggered" className="w-[4rem] truncate font-semibold">
  //       Split triggered
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <StatusBadge
  //       status={row.original.splitTriggered}
  //       activeText="Yes"
  //       inactiveText="No"
  //       inactiveBg="bg-error-100 border-[#FF0000] text-[#FF0000]"
  //     />
  //   ),
  // },
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
  // {
  //   accessorKey: 'reason',
  //   header: 'Reason',
  //   cell: ({ row }) => {
  //     const reasonBool = row.original.reason === 'Harvest' ? true : false

  //     return (
  //       <>
  //         {['Harvest', 'Transfer'].includes(row.original.reason) ? (
  //           <StatusBadge
  //             status={reasonBool}
  //             activeText="Harvest"
  //             inactiveText="Transfer"
  //             activeIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />}
  //             inactiveIcon={<SolarIconSet.MapArrowRight color="currentColor" size={16} />}
  //             inactiveBg="bg-[#E5E7FF] text-[#000AFF] border-[#000AFF]"
  //           />
  //         ) : (
  //           <Text weight="light">-</Text>
  //         )}
  //       </>
  //     )
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => <SamplingReportActionsDropdown samplingData={row?.original} />,
  },
]
