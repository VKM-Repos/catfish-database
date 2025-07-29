import PageTransition from 'src/components/animation/page-transition'
import { FlexBox } from 'src/components/ui/flexbox'
import FarmOverviewStatistics from './farm-overview-statistics'
import GrowthFeedingPerformance from './growth-feeding-performance'
import StockingHarvestOverview from './stocking-harvest-overview'
import CostBreakdownOverview from './cost-breakdown-overview'
import DashboardMenu from './dashboard-menu'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import { useState } from 'react'
import FcrOverall from './fcr.overall'
import FishDistribution from './fish-distribution-by-pond'

export default function FarmerDashboardOverview() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1),
    to: new Date(),
  })
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
  }
  return (
    <PageTransition>
      <DashboardMenu />
      <div className="sticky left-0 top-[100px] z-50 flex h-fit w-full items-center justify-end bg-white py-4">
        <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="w-auto" />
      </div>
      <FarmOverviewStatistics dateRange={dateRange} />
      <GrowthFeedingPerformance dateRange={dateRange} />
      <FlexBox direction="row" justify="between" className="my-10">
        <FcrOverall dateRange={dateRange} />
        <FishDistribution dateRange={dateRange} />
      </FlexBox>

      <FlexBox direction="row" justify="between" className="my-10">
        <StockingHarvestOverview dateRange={dateRange} />
        <CostBreakdownOverview dateRange={dateRange} />
      </FlexBox>
    </PageTransition>
  )
}
