import React from 'react'
import PageTransition from 'src/components/animation/page-transition'
import { useAuthStore } from 'src/store/auth.store'
import FarmerDashboardOverview from './components/farmer'
import CLusterManagerDashboardOverview from './components/cluster-manager'
import SuperAdminDashboard from './components/super-admin'

export default function DashboardOverviewPage() {
  const user = useAuthStore((state) => state.user)
  if (user?.role === 'FARMER') {
    return <FarmerDashboardOverview />
  }
  if (user?.role === 'CLUSTER_MANAGER') {
    return <CLusterManagerDashboardOverview />
  }
  if (user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />
  }
  return (
    <PageTransition>
      <div>No dashboard available for your role.</div>
    </PageTransition>
  )
}
