import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { paths } from 'src/routes/paths'
import { Heading } from 'src/components/ui/heading'
import { Button } from 'src/components/ui/button'
import { clusterResponseSchema } from 'src/schemas/schemas'

const useGetCluster = createGetQueryHook<typeof clusterResponseSchema, { id: string }>({
  endpoint: '/clusters/:id',
  responseSchema: clusterResponseSchema,
  queryKey: ['cluster'],
})

export default function ClusterDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: cluster, isLoading } = useGetCluster({ route: { id: id! } })

  if (!id) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.system.clusters.root)}>
      <DialogContent className="min-h-[410px] overflow-hidden px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : cluster ? (
          <div className="flex h-full flex-col justify-center space-y-8">
            <Heading className="relative top-0 border-none text-center capitalize" level={6}>
              {cluster ? cluster.name : 'Loading...'}
            </Heading>
            <div>
              <Text>Cluster Name</Text>
              <Text weight="light" color="text-neutral-400">
                {cluster.name}
              </Text>
            </div>
            <div>
              <Text>State</Text>
              <Text weight="light" color="text-neutral-400">
                {cluster.state.name}
              </Text>
            </div>
            <div>
              <Text>Description</Text>
              <Text weight="light" color="text-neutral-400">
                {cluster.description}
              </Text>
            </div>

            <div className="flex w-full justify-between space-x-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(paths.dashboard.system.clusters.root)}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                variant="primary"
                onClick={() => navigate(paths.dashboard.system.clusters.edit(cluster.id))}
              >
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <Text>Cluster not found</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}
