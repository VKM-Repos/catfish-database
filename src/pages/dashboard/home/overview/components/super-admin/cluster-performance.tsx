import React from 'react'
import { Card } from 'src/components/ui/card'
import { DataTable } from 'src/components/ui/data-table'
import { Text } from 'src/components/ui/text'
import { clusterPerformanceColumn } from './cluster-performance-column'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { DateRange } from 'src/components/ui/custom-calendar'
interface ClusterPerformanceProps {
  dateRange?: DateRange
}
export default function ClusterPerformance({ dateRange }: ClusterPerformanceProps) {
  const useGetClusterPerformance = createGetQueryHook({
    endpoint: '/dashboards/super-admin/cluster-summary',
    responseSchema: z.any(),
    queryKey: ['cluster-performance-super-admin'],
  })
  const { data: clusterPerformance } = useGetClusterPerformance({
    query: {
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  return (
    <Card className="mt-[20px] border border-neutral-200 p-[20px]">
      <Text className="mb-[20px] text-[14px] font-semibold">Cluster Performance</Text>
      <DataTable
        search={false}
        columns={clusterPerformanceColumn}
        data={clusterPerformance || []}
        isLoading={false}
        emptyStateMessage="No cluster performance found"
        hidePagination={true}
      />
    </Card>
  )
}
