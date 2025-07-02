import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from 'src/components/global/status-badge'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import * as SolarIconSet from 'solar-icon-set'

type LogType = 'CREATE' | 'RESTOCK' | 'DEDUCTION' | 'DELETE' | 'CONSUMPTION' | 'UPDATE' | 'NONE'

const logTypeMap: Record<LogType, { label: string; type: 'active' | 'inactive' }> = {
  CREATE: { label: 'Addition', type: 'active' },
  RESTOCK: { label: 'Addition', type: 'active' },
  DEDUCTION: { label: 'Deduction', type: 'inactive' },
  DELETE: { label: 'Deduction', type: 'inactive' },
  CONSUMPTION: { label: 'Consumption', type: 'inactive' },
  UPDATE: { label: 'Update', type: 'inactive' },
  NONE: { label: 'None', type: 'inactive' },
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <>
        <Text weight="light">{formatDate(row.original.createdAt)}</Text>
        <Text weight="light">{extractTimeFromISO(row.original.createdAt)}</Text>
      </>
    ),
  },
  {
    accessorKey: 'logType',
    header: () => (
      <div title="Type" className="w-[4rem] truncate font-semibold">
        Type
      </div>
    ),
    cell: ({ row }) => {
      const type = row.original.logType as LogType
      const mapped = logTypeMap[type] ?? { label: type, type: 'inactive' }

      const isActive = mapped.type === 'active'

      return (
        <StatusBadge
          status={isActive}
          activeText={mapped.label}
          inactiveText={mapped.label}
          activeIcon={<SolarIconSet.ArrowRightUp color="currentColor" size={16} />}
          inactiveIcon={<SolarIconSet.ArrowRightDown color="currentColor" size={16} />}
          size="sm"
          inactiveConfig={{
            textColor: 'text-[#FF0000] ',
            borderColor: 'border-[#FF0000]',
            backgroundColor: 'bg-error-100',
            dotColor: 'bg-[#FF0000]',
          }}
        />
      )
    },
  },

  {
    accessorKey: 'type',
    header: 'Feed type',
    cell: ({ row }) => (
      <Text className="capitalize" weight="light">
        {row.original.type.toLowerCase() || '-'}
      </Text>
    ),
  },
  {
    accessorKey: 'sizeInMm',
    header: 'Size (mm)',
    cell: ({ row }) => <Text weight="light">{row.original.sizeInMm || '-'}</Text>,
  },
  // {
  //   accessorKey: 'quantityInKg',
  //   header: 'Total feed stocked (kg)',
  //   cell: ({ row }) => <Text weight="light">{row.original.quantityInKg || '-'}</Text>,
  // },
  {
    accessorKey: 'costPerKg',
    header: 'Cost/kg(₦)',
    cell: ({ row }) => {
      const cost = row.original.costPerKg
      return <Text weight="light">{cost ? `₦${Math.round(cost)}` : '-'}</Text>
    },
  },
  // {
  //   accessorKey: 'cost',
  //   header: 'Total cost (₦)',
  //   cell: ({ row }) => <Text weight="light">{`₦${row.original.costPerKg * row.original.quantityInKg}` || '-'}</Text>,
  // },
  {
    accessorKey: 'quantityInKg',
    header: 'Remaining stock',
    cell: ({ row }) => <Text weight="light">{row.original.quantityInKg ?? '-'}</Text>,
  },
]
