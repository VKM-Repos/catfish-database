import { fishBatchResponseType } from 'src/types/ponds.types'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useState } from 'react'
import ViewBatchDetails from '../view'
import EditBatchDetails from '../edit'

export default function ActionsDropdown({ batch }: { batch: fishBatchResponseType }) {
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

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
          {/* <DropdownMenuItem onClick={() => setOpenView(true)}>View</DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewBatchDetails open={openView} setOpenEdit={setOpenEdit} onOpenChange={setOpenView} batch={batch} />
      <EditBatchDetails open={openEdit} onOpenChange={setOpenEdit} batch={batch} />
    </>
  )
}
