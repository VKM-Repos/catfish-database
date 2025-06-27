import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './actions-dropdown'
import { StatusBadge } from 'src/components/global/status-badge'
import { cn } from 'src/lib/utils'
import { Role } from 'src/types/role.types'

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'role',
    header: 'Role Name',
    cell: ({ row }) => <Text weight="light">{row.original.name}</Text>,
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const modules = row.original.modules as any[]

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
      const visibleChips = permissionChips.slice(0, 4)
      const remainingCount = permissionChips.length - visibleChips.length

      return (
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      )
    },
  },

  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => <Text weight="light">{row.original.user}</Text>,
  },

  {
    accessorKey: 'createDate',
    header: 'Created Date',
    cell: ({ row }) => <Text weight="light">{new Date(row.original.createDate).toLocaleString()}</Text>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        activeText="Active"
        inactiveText="Deactivated"
        inactiveBg="bg-[#737780]/10 border-[#737780] text-[#737780]"
        inactiveIcon={
          <div className={cn('h-2 w-2 rounded-full', row.original.status ? 'bg-success-400' : 'bg-[#737780]')} />
        }
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown role={row?.original} />,
  },
]
