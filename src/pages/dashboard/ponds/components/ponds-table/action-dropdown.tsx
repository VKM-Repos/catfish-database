import { Button } from 'src/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import * as SolarIconSet from 'solar-icon-set'

type ActionsDropdownProps = {
  pond: any
}

export function ActionsDropdown({ pond }: ActionsDropdownProps) {
  const navigate = useNavigate()

  const openPondDetails = (id: string) => {
    navigate(paths.dashboard.ponds.view(id))
  }

  return (
    <>
      <Button
        variant="ghost"
        className="flex items-center gap-1 text-[#651391]"
        onClick={() => {
          openPondDetails(pond?.id)
        }}
      >
        <span>View</span>
        <SolarIconSet.ArrowRightUp size={16} color="currentColor" />
      </Button>
    </>
  )
}
