import PageTransition from 'src/components/animation/page-transition'
import { FlexBox } from 'src/components/ui/flexbox'
import FarmOverviewStatistics from './farm-overview-statistics'
import GrowthFeedingPerformance from './growth-feeding-performance'
import StockingHarvestOverview from './stocking-harvest-overview'
import CostBreakdownOverview from './cost-breakdown-overview'
import DashboardMenu from './dashboard-menu'

export default function FarmerDashboardOverview() {
  return (
    <PageTransition>
      <DashboardMenu />
      <FarmOverviewStatistics />
      <GrowthFeedingPerformance />
      <FlexBox direction="row" justify="between" className="my-10">
        <StockingHarvestOverview />
        <CostBreakdownOverview />
      </FlexBox>
    </PageTransition>
  )
}
