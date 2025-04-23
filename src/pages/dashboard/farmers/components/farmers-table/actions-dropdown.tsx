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
import { DeactivateUserDialog } from '../modals/deactivate-user'
import { useState } from 'react'
import type { User } from 'src/types'

type ActionsDropdownProps = {
  user: User
}

export function ActionsDropdown({ user }: ActionsDropdownProps) {
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
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.farmers.view(user.id))}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.farmers.id(user.id))}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMenu(true)}>
            {user.accountNonLocked ? 'Deactivate Farmer' : 'Activate Farmer'}{' '}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeactivateUserDialog user={user} open={menu} onOpenChange={setMenu} />
    </>
  )
}
