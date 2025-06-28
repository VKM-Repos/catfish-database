import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { MaintenanceExpenseActions } from './actions'
import { formatPrice } from 'src/lib/utils'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.updatedAt)}</Text>,
  },
  {
    accessorKey: 'maintenanceType',
    header: 'Activity type',
    cell: ({ row }) => {
      const type = row.original.maintenanceType || '-'
      const colorMap: Record<string, string> = {
        LABOR: '#F59E42',
        CHEMICALS: '#1E90FF',
        EQUIPMENT: '#A020F0',
        ENERGY: '#FFD700',
        CLEANING: '#000AFF',
        REPAIRS: '#FF9040',
        DISINFECTION: '#0DA500',
        OTHER: '#A1A4AA',
      }
      const dotColor = colorMap[type.toUpperCase()] || '#000000'
      // Format label for display (capitalize, remove underscores)
      const label = type
        .toLowerCase()
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      return (
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: dotColor,
              width: 10,
              height: 10,
              borderRadius: '50%',
              minWidth: 10,
            }}
          />
          <Text weight="light">{label}</Text>
        </div>
      )
    },
  },
  {
    accessorKey: 'cost',
    header: 'Total cost (₦)',
    cell: ({ row }) => <Text weight="light">{formatPrice(row.original.cost) || '-'}</Text>,
  },
  {
    accessorKey: 'pond',
    header: 'Pond',
    cell: ({ row }) => <Text weight="light">{row.original.pond?.name ?? '-'}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <MaintenanceExpenseActions item={row?.original} />,
  },
]
