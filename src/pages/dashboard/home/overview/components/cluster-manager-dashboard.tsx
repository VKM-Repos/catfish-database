import PageTransition from 'src/components/animation/page-transition'
import { FlexBox } from 'src/components/ui/flexbox'
import ClusterFarmOverviewStats from './cluster-manager-farm-overview-stats'
import FeedingInsight from './feeding-insight'
import ClusterHealthAlert from './cluster-health-alert'
import ProductAndHarvestMetrics from './product-and-harvest-metrics'
import DashboardMenu from './dashboard-menu'

export default function CLusterManagerDashboardOverview() {
  return (
    <PageTransition>
      <DashboardMenu />
      <FlexBox direction="col" className="mt-5">
        <ClusterFarmOverviewStats />
        <FlexBox className="mb-[20px] w-full" direction="row">
          <FeedingInsight />
          <ClusterHealthAlert />
        </FlexBox>
      </FlexBox>
      <ProductAndHarvestMetrics />
    </PageTransition>
  )
}
