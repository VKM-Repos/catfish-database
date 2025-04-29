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
import { useState } from 'react'

type ActionsDropdownProps = {
  pond: any
}

export function ActionsDropdown({ pond }: ActionsDropdownProps) {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)

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
          <DropdownMenuItem disabled onClick={() => navigate(paths.dashboard.ponds.root)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem disabled onClick={() => navigate(paths.dashboard.ponds.root)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMenu(true)}>
            {pond.pondStatus ? 'Deactivate Pond' : 'Activate Pond'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
