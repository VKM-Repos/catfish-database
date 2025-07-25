import type { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { extractTimeFromISO, formatDate } from 'src/lib/date'
import { ActionsDropdown } from './action-dropdown'

export const formatString = (key: string) => {
  if (!key) return ''
  return key
    .replace(/_/g, ' ') // Replace underscores with space
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .toLowerCase() // Make the entire string lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Text className="capitalize" weight="light">
        {formatString(row.original.key) || '-'}
      </Text>
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const values = row.original?.listValue as any[]

      // if (values.length === 0) return '-'

      // Slice first 4, rest is overflow
      const visibleChips = values.slice(0, 3)
      const remainingCount = values.length - visibleChips.length

      return (
        <div className="flex flex-wrap items-center gap-2">
          {row.original?.value && (
            <div className="rounded-[4rem] border border-neutral-200 bg-primary-100 px-2 py-1 text-sm capitalize text-primary-500">
              {row.original?.value}
            </div>
          )}

          {row.original?.listValue[0] !== '' && (
            <>
              {visibleChips.map((chip, index) => (
                <div
                  key={index}
                  className="rounded-[4rem] border border-neutral-200 bg-primary-100 px-2 py-1 text-sm capitalize text-primary-500"
                >
                  {chip}
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="rounded-[4rem] border border-neutral-200 bg-primary-100 px-2 py-1 text-sm text-primary-500">
                  +{remainingCount}
                </div>
              )}
            </>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className="rounded-[4rem] border border-info-500 bg-info-100 px-2 py-1 text-center text-sm capitalize text-info-500">
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const styleMap = {
        Security: {
          text: 'text-warning-400',
          bg: 'bg-warning-100',
          border: 'border-warning-400',
        },
        Feeding: {
          text: 'text-neutral-300',
          bg: 'bg-neutral-100',
          border: 'border-neutral-300',
        },
        Maintenance: {
          text: 'text-success-500',
          bg: 'bg-success-100',
          border: 'border-success-500',
        },
        Reporting: {
          text: 'text-error-500',
          bg: 'bg-error-100',
          border: 'border-error-500',
        },
      }

      const category: string = row.original.category
      const style =
        category in styleMap
          ? styleMap[category as keyof typeof styleMap]
          : {
              text: 'text-neutral-500',
              bg: 'bg-neutral-100',
              border: 'border-neutral-500',
            }

      return (
        <div
          className={`rounded-[4rem] px-2 py-1 text-center text-sm capitalize ${style.text} ${style.bg} border ${style.border}`}
        >
          {category}
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ row }) => (
      <>
        <Text weight="light">{formatDate(row.original.updatedAt)}</Text>
        <Text weight="light">{extractTimeFromISO(row.original.updatedAt)}</Text>
      </>
    ),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsDropdown config={row?.original} />,
  },
]
