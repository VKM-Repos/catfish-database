import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'sample',
    header: () => (
      <div title="No. fish Sampled" className="w-[4rem] truncate font-semibold">
        No. fish Sampled
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.sample}</Text>,
  },
  {
    accessorKey: 'weight',
    header: () => (
      <div title="Wgt fish Sampled" className="w-[4rem] truncate font-semibold">
        Wgt fish Sampled
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
    header: 'Feed Consumed',
    cell: ({ row }) => <Text weight="light">{row.original.feedConsumed}</Text>,
  },
  {
    accessorKey: 'mortality',
    header: 'Mort',
    cell: ({ row }) => <Text weight="light">{row.original.mortality}</Text>,
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
]
