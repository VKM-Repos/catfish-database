import { MoreHorizontal } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useLocation } from 'react-router-dom'
import { pondResponseType } from 'src/types/ponds.types'
import UpdatePondPage from '../edit'
import { useState } from 'react'

type ActionsDropdownType = {
  pond: pondResponseType
}

export default function ActionsDropdown({ pond }: ActionsDropdownType) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const [open, setOpen] = useState(false)

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
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit pond</DropdownMenuItem>
          <DropdownMenuItem>Delete pond</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdatePondPage open={open} onOpenChange={setOpen} pond={pond} />
    </>
  )
}
