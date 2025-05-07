import { Outlet, useNavigate } from 'react-router-dom'
import { Inline } from 'src/components/ui/inline'
import { Spacer } from 'src/components/ui/spacer'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { stockingHistory, StockingHistoryTable } from './table'

export default function StockingHistory() {
  const title = 'Stocking History'
  const navigate = useNavigate()

  const openCreateModal = () => {
    navigate(paths.dashboard.farmers.create)
  }

  const actions = stockingHistory && stockingHistory.length > 0 && (
    <Inline>
      <Button variant="outline" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add new stock</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative pb-[5rem]">
      <div className="flex items-center justify-between">
        <Text className="!text-lg font-bold">Stocking history</Text>
        {actions}
      </div>
      <Spacer />
      <StockingHistoryTable />
      <Outlet />
    </div>
  )
}
