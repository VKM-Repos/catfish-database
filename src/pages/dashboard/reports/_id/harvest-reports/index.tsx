import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { paths } from 'src/routes/paths'
import { Heading } from 'src/components/ui/heading'
import { Button } from 'src/components/ui/button'
import { clusterManagerResponseSchema } from 'src/schemas'
import { Grid } from 'src/components/ui/grid'

const useGetClusterManager = createGetQueryHook<typeof clusterManagerResponseSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: clusterManagerResponseSchema,
  queryKey: ['cluster-manager'],
})

export default function FeedingReportsDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading } = useGetClusterManager({ route: { id: id! } })

  if (!id) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.reports.root)}>
      <DialogContent className="min-h-[410px] overflow-hidden px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : user ? (
          <div className="flex h-full flex-col justify-center space-y-8">
            <Heading className="relative top-0 border-none text-center capitalize" level={6}>
              Cluster manager details
            </Heading>
            <Grid cols={2} gap="gap-4">
              <div>
                <Text>First Name</Text>
                <Text weight="light" color="text-neutral-400">
                  {user.firstName}
                </Text>
              </div>
              <div>
                <Text>Last Name</Text>
                <Text weight="light" color="text-neutral-400">
                  {user.lastName}
                </Text>
              </div>
            </Grid>

            <div>
              <Text>Email</Text>
              <Text weight="light" color="text-neutral-400">
                {user.email}
              </Text>
            </div>
            <div>
              <Text>Cluster</Text>
              <Text weight="light" color="text-neutral-400">
                {user.cluster?.name}
              </Text>
            </div>
            <div>
              <Text>Phone</Text>
              <Text weight="light" color="text-neutral-400">
                {user.phone}
              </Text>
            </div>

            <div className="flex w-full justify-between space-x-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(paths.dashboard.clusterManagers.root)}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                variant="primary"
                onClick={() => navigate(paths.dashboard.clusterManagers.id(user.id))}
              >
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <Text>User not found</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}
