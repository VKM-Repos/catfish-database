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
// import { DeactivateUserDialog } from '../modals/deactivate-user'
import type { User } from 'src/types'
import * as SolarIconSet from 'solar-icon-set'

type ActionsDropdownProps = {
  user: User
}

export function ReportActionsDropdown({ user }: ActionsDropdownProps) {
  const navigate = useNavigate()

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
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.reports.view(user.id))}>
            <SolarIconSet.Eye /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.reports.editFeedingReport(user.id))}>
            <SolarIconSet.Pen2 /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
