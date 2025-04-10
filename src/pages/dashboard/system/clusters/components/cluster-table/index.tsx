import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { clusterResponseSchema } from 'src/schemas/schemas'
import { z } from 'zod'

export function ClusterTable() {
  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.array(clusterResponseSchema),
    queryKey: ['clusters'],
  })
  const { data: clusters = [], isLoading } = useGetClusters()

  console.log(clusters)

  return <DataTable columns={columns} data={clusters} isLoading={isLoading} emptyStateMessage="No clusters found" />
}
