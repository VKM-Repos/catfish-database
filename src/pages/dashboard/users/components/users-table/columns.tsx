import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { ActionsDropdown } from './actions-dropdown'
import { StatusBadge } from 'src/components/global/status-badge'
import { RoleBadge } from 'src/components/global/role-badge'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'firstName',
    header: 'FirstName',
    cell: ({ row }) => <Text weight="light">{row?.original.firstName}</Text>,
  },
  {
    accessorKey: 'LastName',
    header: 'LastName',
    cell: ({ row }) => <Text weight="light">{row?.original.lastName}</Text>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Text weight="light">{row?.original.email}</Text>,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => <Text weight="light">{row?.original.phone}</Text>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <RoleBadge role={row?.original.role} size="sm" variant="default" />,
  },
  {
    accessorKey: 'cluster',
    header: 'Cluster',
    cell: ({ row }) => <Text weight="light">{row?.original.cluster?.name}</Text>,
  },
  {
    accessorKey: 'enabled',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue('enabled')}
        activeText="Active"
        inactiveText="Deactivated"
        size="sm"
        inactiveConfig={{
          textColor: 'text-[#737780]',
          borderColor: 'border-[#737780]',
          backgroundColor: 'bg-[#737780]/10',
          dotColor: 'bg-[#737780]',
        }}
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row?.original} />,
  },
]
