import React from 'react'
import PageTransition from 'src/components/animation/page-transition'
import DashboardMenu from '../dashboard-menu'
import { FlexBox } from 'src/components/ui/flexbox'
import SuperAdminSystemStats from './super-admin-system-stats'
import HarvestVolumeTrends from './harvest-volume-trends'
import { StockedHarvestedByCluster } from './stocked-harvested-by-cluster'
import { FeedInsight } from './feed-insight'
import SuperAdminClusterHealthAlert from './super-admin-cluster-health-alert'
import ClusterPerformance from './cluster-performance'

export default function SuperAdminDashboard() {
  return (
    <PageTransition>
      <DashboardMenu />
      <FlexBox direction="col" className="mt-5">
        <SuperAdminSystemStats />
        <FlexBox className="w-full" direction="row">
          <HarvestVolumeTrends />
          <StockedHarvestedByCluster />
        </FlexBox>
      </FlexBox>
      <FlexBox className="mt-[20px]">
        <FeedInsight />
        <SuperAdminClusterHealthAlert />
      </FlexBox>
      <ClusterPerformance />
    </PageTransition>
  )
}
