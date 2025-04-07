import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { Link } from 'react-router-dom'

export function HelpIcon() {
  return (
    <Link to={paths.dashboard.helpCenter}>
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary-600 hover:text-primary-400">
        <SolarIconSet.QuestionCircle color="currentColor" size={20} iconStyle="Outline" />
      </Button>
    </Link>
  )
}
