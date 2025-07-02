import { Button } from 'src/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

type MaintenanceExpenseActionsProps = {
  item: any
}
export function MaintenanceExpenseActions({ item }: MaintenanceExpenseActionsProps) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[8rem] p-0">
        <DropdownMenuItem
          onClick={() => navigate(paths.dashboard.inventory.editMaintenanceRecord(item.id), { state: { item } })}
          className="border-b border-b-neutral-200 transition-all hover:border-b-4 hover:border-primary-400"
        >
          Edit
        </DropdownMenuItem>
        <div className="border-b border-neutral-200" />
        <DropdownMenuItem
          onClick={() => {
            /* handle delete here */
          }}
          className="border-b border-b-neutral-200 text-error-500 transition-all hover:border-b-4 hover:border-primary-400"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
