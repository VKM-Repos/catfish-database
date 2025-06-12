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
import { Audit } from 'src/types/audit.types'

type ActionsDropdownProps = {
  audit: Audit
}

export function ActionsDropdown({ audit }: ActionsDropdownProps) {
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
          <DropdownMenuItem
            onClick={() =>
              navigate(paths.dashboard.system.auditLog.id(audit.id), {
                state: { audit },
              })
            }
          >
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DeleteClusterDialog cluster={audit} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} /> */}
    </>
  )
}
