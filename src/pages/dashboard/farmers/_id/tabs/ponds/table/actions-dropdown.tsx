import { MoreHorizontal } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { pondResponseType } from 'src/types/ponds.types'
import UpdatePondPage from 'src/pages/dashboard/ponds/_id/edit'
import { useState } from 'react'

type ActionsDropdownType = {
  pond: pondResponseType
}

export default function ActionsDropdown({ pond }: ActionsDropdownType) {
  const [open, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const id = pond?.id
  const openDialog = () => {
    setIsOpen(true)
  }

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
          <DropdownMenuItem onClick={openDialog}>Edit pond</DropdownMenuItem>
          <DropdownMenuItem>Delete pond</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdatePondPage open={open} onOpenChange={setIsOpen} id={id} />
    </>
  )
}
