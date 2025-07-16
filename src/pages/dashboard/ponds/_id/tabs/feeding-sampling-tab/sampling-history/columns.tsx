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
      <div title="Number of fish sampled" className="w-[4rem] truncate font-semibold">
        Fish sampled
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.sample}</Text>,
  },
  {
    accessorKey: 'weight',
    header: () => (
      <div title="Weight of fish sampled" className="w-[4rem] truncate font-semibold">
        Weight
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.weight}</Text>,
  },
  {
    accessorKey: 'averageWeightToFish',
    header: () => (
      <div title="Average weight" className="font-semibold">
        Average weight
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.averageWeightToFish}</Text>,
  },
  {
    accessorKey: 'weightGain',
    header: () => (
      <div title="Total weight gain" className="w-[4rem] truncate font-semibold">
        Total weight gain
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.weightGain}</Text>,
  },
  // {
  //   accessorKey: 'splitTriggered',
  //   header: () => (
  //     <div title="Split triggered" className="w-[4rem] truncate font-semibold">
  //       Split triggered
  //     </div>
  //   ),
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
]
