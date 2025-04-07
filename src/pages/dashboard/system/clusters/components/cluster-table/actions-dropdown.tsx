import { MoreHorizontal } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Cluster } from 'src/types/cluster.types'
import { DeleteClusterDialog } from '../modals/delete-cluster'
import { useState } from 'react'

type ActionsDropdownProps = {
  cluster: Cluster
}

export function ActionsDropdown({ cluster }: ActionsDropdownProps) {
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.system.clusters.id(cluster.id))}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.system.clusters.edit(cluster.id))}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteClusterDialog cluster={cluster} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </>
  )
}
