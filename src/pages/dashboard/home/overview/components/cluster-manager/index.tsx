import PageTransition from 'src/components/animation/page-transition'
import { FlexBox } from 'src/components/ui/flexbox'
import ClusterFarmOverviewStats from './cluster-manager-farm-overview-stats'
import FeedingInsight from './feeding-insight'
import ClusterHealthAlert from './cluster-health-alert'
import ProductAndHarvestMetrics from './product-and-harvest-metrics'
import DashboardMenu from '../farmer/dashboard-menu'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import { useState } from 'react'
import { FeedsPriceTrends } from './feeds-price-trends'
import KeyHealthMetrics from './key-health-metrics'

export default function CLusterManagerDashboardOverview() {
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

      <div className="sticky left-0 top-[100px] z-0 flex h-fit w-full items-center justify-end bg-white py-4">
        <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="w-auto" />
      </div>
      <FlexBox direction="col" className="mt-5">
        <ClusterFarmOverviewStats dateRange={dateRange} />
        <FlexBox className="mb-[20px] w-full lg:flex-row" direction="col">
          <FeedingInsight dateRange={dateRange} />
          <FeedsPriceTrends dateRange={dateRange} />
        </FlexBox>
        <FlexBox className="mb-[20px] w-full lg:flex-row" direction="col">
          <KeyHealthMetrics />
          <ClusterHealthAlert />
        </FlexBox>
      </FlexBox>
      <ProductAndHarvestMetrics dateRange={dateRange} />
    </PageTransition>
  )
}
