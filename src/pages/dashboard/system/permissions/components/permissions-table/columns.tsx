import { ColumnDef } from '@tanstack/react-table'
import { Switch } from 'src/components/ui/switch'
import { Text } from 'src/components/ui/text'
import { ColumnFactoryProps, PermissionRow, SwitchCellProps } from '../../types'

const createSwitchColumn = ({ type, onToggle }: SwitchCellProps): ColumnDef<PermissionRow> => ({
  accessorKey: type,
  header: type.charAt(0).toUpperCase() + type.slice(1),
  cell: ({ row }) => {
    const value = row.original[type]
    const module = row.original.module

    return <Switch checked={value} onCheckedChange={(val) => onToggle(module, type, val)} />
  },
})

const moduleNameMap: Record<string, string> = {
  systemConfig: 'System Configuration',
  userManagement: 'User Management',
  clusterManagement: 'Cluster Management',
  pondSetup: 'Pond Setup',
  batchSetup: 'Fish(batch) Setup',
  farmReport: 'Daily Farm Report',
  sampling: 'Sampling',
  harvestReport: 'Harvest Report',
  reportingAnalytics: 'Report and Analytics',
  maintenance: 'Maintenance',
}

const permissionTypes = ['access', 'edit', 'view', 'delete', 'create'] as const

export const createColumns = ({ handleToggle }: ColumnFactoryProps): ColumnDef<PermissionRow>[] => [
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => <Text weight="light">{formatModuleName(row.original.module)}</Text>,
  },
  ...permissionTypes.map((type) =>
    createSwitchColumn({
      type,
      onToggle: handleToggle,
    }),
  ),
]

const formatModuleName = (key: string) => moduleNameMap[key]
