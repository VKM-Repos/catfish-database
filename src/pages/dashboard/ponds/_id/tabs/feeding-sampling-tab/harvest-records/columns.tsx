import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { StatusBadge } from 'src/components/global/status-badge'
import * as SolarIconSet from 'solar-icon-set'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{row.original.date}</Text>,
  },
  {
    accessorKey: 'fishPopulation',
    header: () => (
      <div title="Fish population" className="w-[4rem] truncate font-bold">
        Fish population
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.fishPopulation}</Text>,
  },
  {
    accessorKey: 'sampleSize',
    header: () => (
      <div title="Sample size" className="w-[4rem] truncate font-bold">
        Sample size
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.sampleSize}</Text>,
  },
  {
    accessorKey: 'averageWeight',
    header: () => (
      <div title="Average weight" className="font-bold">
        Average weight
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.averageWeight}</Text>,
  },
  {
    accessorKey: 'averageWeightGain',
    header: () => (
      <div title="Average weight gain" className="w-[4rem] truncate font-bold">
        Average weight gain
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.averageWeightGain}</Text>,
  },
  {
    accessorKey: 'mortality',
    header: 'Mortality',
    cell: ({ row }) => <Text weight="light">{row.original.mortality}</Text>,
  },
  {
    accessorKey: 'splitTriggered',
    header: () => (
      <div title="Split triggered" className="w-[4rem] truncate font-bold">
        Split triggered
      </div>
    ),
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.splitTriggered}
        activeText="Yes"
        inactiveText="No"
        inactiveBg="bg-error-100 border-[#FF0000] text-[#FF0000]"
      />
    ),
  },
  {
    accessorKey: 'fishMoved',
    header: () => (
      <div title="Number of fish moved" className="w-[4rem] truncate font-bold">
        No. of fish moved
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.fishMoved}</Text>,
  },
  {
    accessorKey: 'destinationPond',
    header: () => (
      <div title="Destination pond" className=" font-bold">
        Destination pond
      </div>
    ),
    cell: ({ row }) => <Text weight="light">{row.original.destinationPond}</Text>,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => {
      const reasonBool = row.original.reason === 'Harvest' ? true : false

      return (
        <>
          {['Harvest', 'Transfer'].includes(row.original.reason) ? (
            <StatusBadge
              status={reasonBool}
              activeText="Harvest"
              inactiveText="Transfer"
              activeIcon={<SolarIconSet.CheckCircle color="currentColor" size={16} />}
              inactiveIcon={<SolarIconSet.MapArrowRight color="currentColor" size={16} />}
              inactiveBg="bg-[#E5E7FF] text-[#000AFF] border-[#000AFF]"
            />
          ) : (
            <Text weight="light">-</Text>
          )}
        </>
      )
    },
  },
]
