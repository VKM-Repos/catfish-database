import React from 'react'
import { Card } from 'src/components/ui/card'
import { DataTable } from 'src/components/ui/data-table'
import { Text } from 'src/components/ui/text'
import { clusterPerformanceColumn } from './cluster-performance-column'

export default function ClusterPerformance() {
  const performance = [
    {
      cluster: 'Ekiti-cluster',
      farmers: 238,
      harvested: 2458,
      mortality: 78,
      submission: 93,
      status: 'good',
    },
    {
      cluster: 'Oyo-cluster',
      farmers: 312,
      harvested: 3875,
      mortality: 124,
      submission: 88,
      status: 'medium',
    },
    {
      cluster: 'Kwara-cluster',
      farmers: 175,
      harvested: 1980,
      mortality: 62,
      submission: 76,
      status: 'good',
    },
    {
      cluster: 'Ondo-cluster',
      farmers: 290,
      harvested: 3240,
      mortality: 105,
      submission: 91,
      status: 'medium',
    },
    {
      cluster: 'Osun-cluster',
      farmers: 201,
      harvested: 2150,
      mortality: 83,
      submission: 79,
      status: 'critical',
    },
  ]
  return (
    <Card className="mt-[20px] border border-neutral-200 p-[20px]">
      <Text className="mb-[20px] text-[14px] font-semibold">Cluster Performance</Text>
      <DataTable
        search={false}
        columns={clusterPerformanceColumn}
        data={performance || []}
        isLoading={false}
        emptyStateMessage="No cluster performance found"
        hidePagination={true}
      />
    </Card>
  )
}
