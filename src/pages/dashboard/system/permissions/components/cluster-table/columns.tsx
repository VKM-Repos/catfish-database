import { ColumnDef } from '@tanstack/react-table'
import { Text } from 'src/components/ui/text'
import { z } from 'zod'
import { ActionsDropdown } from './actions-dropdown'
import { clusterResponseSchema } from 'src/schemas/schemas'
import { Avatar, AvatarFallback } from 'src/components/ui/avatar'
import { User, UserRole } from 'src/types'
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/ui/tooltip'

type ClusterWithUsers = z.infer<typeof clusterResponseSchema> & {
  users?: User[] // Add users property
}

export const columns: ColumnDef<ClusterWithUsers>[] = [
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
    accessorKey: 'users',
    header: 'Managers',
    cell: ({ row }) => {
      const users: User[] = row.original.users || []
      const clusterManagers = users.filter((user) => user.role === UserRole.CLUSTER_MANAGER)

      return (
        <div className="flex items-center">
          {clusterManagers.length > 0 ? (
            clusterManagers.map((user) => (
              <div key={user.id} className="-mr-2 flex items-center">
                <Tooltip key={user.id}>
                  <TooltipTrigger>
                    <Avatar className="border border-neutral-200">
                      <AvatarFallback>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.firstName} {user.lastName}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <Text weight="light">{row.original.description}</Text>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown cluster={row.original} />,
  },
]
