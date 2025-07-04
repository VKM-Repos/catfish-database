import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './actions-dropdown'
import { Role } from 'src/types/role.types'

const formatString = (key: string) => {
  if (!key) return ''
  return key
    .replace(/_/g, ' ') // Replace underscores with space
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .toLowerCase() // Make the entire string lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}
export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'role',
    header: 'Role Name',
    cell: ({ row }) => <Text weight="light">{formatString(row.original.name)}</Text>,
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const modules = row.original.modules as any[]

      // console.log(row.original.modules)

      // Map permission keys to display names
      const permissionLabels: Record<string, string> = {
        access: 'Access',
        view: 'View',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
      }

      // Extract all permission labels from modules
      const permissionChips: string[] = []

      modules.forEach((mod) => {
        Object.entries(permissionLabels).forEach(([key, label]) => {
          if (mod[key]) {
            permissionChips.push(`${label} ${mod.moduleName}`)
          }
        })
      })

      // Slice first 4, rest is overflow
      const visibleChips = permissionChips.slice(0, 8)
      const remainingCount = permissionChips.length - visibleChips.length

      return (
        <div className="flex flex-wrap items-center gap-2">
          {visibleChips.map((chip, index) => (
            <div
              key={index}
              className="rounded-[4rem] border border-neutral-200 bg-primary-100 px-2 py-1 text-sm capitalize text-primary-500"
            >
              {formatString(chip)}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="rounded-[4rem] border border-neutral-200 bg-primary-100 px-2 py-1 text-sm text-primary-500">
              +{remainingCount}
            </div>
          )}
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown role={row?.original} />,
  },
]
