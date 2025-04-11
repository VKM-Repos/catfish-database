import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { clusterResponseSchema } from 'src/schemas/schemas'

type Cluster = z.infer<typeof clusterResponseSchema>

export const columns: ColumnDef<Cluster>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <Text weight="light">{row.original.name}</Text>,
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => <Text weight="light">{row.original.state.name}</Text>,
  },
  {
    accessorKey: 'users', // Change to managers
    header: 'Managers',
    cell: ({ row }) => {
      const users = row.original.users
      const fullName =
        users && users.length > 0 ? users?.map((user) => `${user.firstName} ${user.lastName}`).join(', ') : '-' // Return a dash if no users

      return <Text weight="light">{fullName}</Text>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  },
]
