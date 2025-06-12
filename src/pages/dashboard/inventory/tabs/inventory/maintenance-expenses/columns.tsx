import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { MaintenanceExpenseActions } from './actions'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => <Text weight="light">{formatDate(row.original.updatedAt)}</Text>,
  },
  {
    accessorKey: 'type',
    header: 'Activity type',
    cell: ({ row }) => {
      const type = row.original.type || '-'
      const colorMap: Record<string, string> = {
        Disinfection: '#0DA500',
        Others: '#651391',
        Repairs: '#FF9040',
        Cleaning: '#000AFF',
      }
      const dotColor = colorMap[type] || '#A1A4AA'
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
          <Text weight="light">{type}</Text>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description || '-'}</Text>,
  },
  {
    accessorKey: 'cost',
    header: 'Total cost (₦)',
    cell: ({ row }) => <Text weight="light">{`₦${row.original.cost}` || '-'}</Text>,
  },
  {
    accessorKey: 'pond',
    header: 'Pond',
    cell: ({ row }) => <Text weight="light">{row.original.pond ?? '-'}</Text>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <MaintenanceExpenseActions item={row?.original} />,
  },
]
