import React from 'react'
import PageTransition from 'src/components/animation/page-transition'
import { useAuthStore } from 'src/store/auth.store'
import FarmerDashboardOverview from './components/farmer-dashboard'
import CLusterManagerDashboardOverview from './components/cluster-manager-dashboard'
import SuperAdminDashboard from './components/super-admin/super-admin-dashboard'

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
