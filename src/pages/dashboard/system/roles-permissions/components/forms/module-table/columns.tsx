import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from 'src/components/ui/checkbox'

import { Text } from 'src/components/ui/text'
import { ColumnFactoryProps, PermissionRow, SwitchCellProps } from 'src/pages/dashboard/system/permissions/types'
// import { ColumnFactoryProps, PermissionRow, SwitchCellProps } from '../../types'

const formatModuleName = (key: string) => {
  if (!key) return ''
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const createSwitchColumn = ({ type, onToggle }: SwitchCellProps): ColumnDef<PermissionRow> => ({
  accessorKey: type,
  header: type.charAt(0).toUpperCase() + type.slice(1),
  cell: ({ row }) => {
    const value = row.original[type]
    const module = row.original.module
    // console.log(row.original[type])
    return (
      <Checkbox
        checked={!!value}
        onCheckedChange={(val) => {
          if (typeof val === 'boolean') {
            onToggle(module, type, val)
          }
        }}
      />
    )

    // return <Checkbox checked={value} onCheckedChange={(val) => console.log(val)} />
  },
})

const permissionTypes = ['access', 'view', 'create', 'edit', 'delete'] as const

export const createColumns = ({ handleToggle }: ColumnFactoryProps): ColumnDef<PermissionRow>[] => [
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => <Text weight="light">{formatModuleName(row.original.moduleName || row.original.module)}</Text>,
  },
  ...permissionTypes.map((type) =>
    createSwitchColumn({
      type,
      onToggle: handleToggle,
    }),
  ),
]
