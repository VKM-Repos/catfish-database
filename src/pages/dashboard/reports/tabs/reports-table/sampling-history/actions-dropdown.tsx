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
import * as SolarIconSet from 'solar-icon-set'

type ActionsDropdownProps = {
  samplingData: any
}

export function SamplingReportActionsDropdown({ samplingData }: ActionsDropdownProps) {
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
          <DropdownMenuItem
            onClick={() =>
              navigate(paths.dashboard.reports.viewSamplingReport(samplingData.id), {
                state: {
                  samplingData,
                },
              })
            }
          >
            <SolarIconSet.Eye /> View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
