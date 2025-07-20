import React, { useState } from 'react'
import PageTransition from 'src/components/animation/page-transition'
import DashboardMenu from '../farmer/dashboard-menu'
import { FlexBox } from 'src/components/ui/flexbox'
import SuperAdminSystemStats from './super-admin-system-stats'
import HarvestVolumeTrends from './harvest-volume-trends'
import { StockedHarvestedByCluster } from './stocked-harvested-by-cluster'
import SuperAdminClusterHealthAlert from './super-admin-cluster-health-alert'
import ClusterPerformance from './cluster-performance'
import FeedInsight from './feed-insight'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'

export default function SuperAdminDashboard() {
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
      <FlexBox direction="col" className="mt-5">
        <SuperAdminSystemStats dateRange={dateRange} />
        <FlexBox className="w-full" direction="row">
          <HarvestVolumeTrends dateRange={dateRange} />
          <StockedHarvestedByCluster dateRange={dateRange} />
        </FlexBox>
      </FlexBox>
      <FlexBox className="mt-[20px]">
        <FeedInsight />
        <SuperAdminClusterHealthAlert />
      </FlexBox>
      <ClusterPerformance dateRange={dateRange} />
    </PageTransition>
  )
}
