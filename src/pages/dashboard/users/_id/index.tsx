import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { paths } from 'src/routes/paths'
import { userResponseSchema } from 'src/schemas/schemas'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Heading } from 'src/components/ui/heading'
import { Button } from 'src/components/ui/button'

const useGetUsDetails = createGetQueryHook<typeof userResponseSchema, { id: string }>({
  endpoint: '/users/:id',
  responseSchema: userResponseSchema,
  queryKey: ['user'],
})

export default function UserDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetUsDetails({ route: { id: id! } })

  if (!id) {
    return null
  }

  const user_details = [
    { label: 'First Name', value: data?.firstName },
    { label: 'Last Name', value: data?.lastName },
    { label: 'Email', value: data?.email },
    { label: 'Phone Number', value: data?.phone },
    { label: 'Cluster', value: data?.cluster?.name ?? '' },
    { label: 'Role', value: data?.role ?? '' },
  ]

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.users.root)}>
      <DialogContent className="min-h-[410px] overflow-hidden px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : user_details ? (
          <div className="flex h-full flex-col justify-center space-y-8">
            <Heading className="relative top-0 border-none text-center capitalize" level={6}>
              {user_details ? data?.firstName : 'Loading...'}
            </Heading>
            <Grid cols={2} gap="gap-6" className="w-full !grid-cols-2 text-sm">
              {user_details.map((item) => (
                <FlexBox key={item.label} gap="gap-2" direction="col">
                  <Text variant="body" color="text-neutral-500" weight="semibold">
                    {item.label}
                  </Text>
                  <Text variant="body" color="text-neutral-500" weight="light">
                    {item.value}
                  </Text>
                </FlexBox>
              ))}
            </Grid>

            <div className="flex w-full justify-between space-x-2">
              <Button className="w-full" variant="outline" onClick={() => navigate(paths.dashboard.users.root)}>
                Cancel
              </Button>
              <Button className="w-full" variant="primary" onClick={() => navigate(paths.dashboard.users.edit(id))}>
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
