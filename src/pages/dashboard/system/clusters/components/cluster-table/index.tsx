import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { clusterResponseSchema } from 'src/schemas/schemas'

const clustersSchema = z.array(clusterResponseSchema)

export function ClusterTable() {
  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: clustersSchema,
    queryKey: ['clusters'],
  })
  const { data: clusters = [], isLoading } = useGetClusters()

  console.log(clusters)

  return <DataTable columns={columns} data={clusters} isLoading={isLoading} emptyStateMessage="No clusters found" />
}
