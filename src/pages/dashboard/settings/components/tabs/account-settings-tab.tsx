import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import ProfileDialog from '../dialogs/profile-dialog'
import PasswordDialog from '../dialogs/password-dialog'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { userSchema } from 'src/schemas/schemas'
import { Loader } from 'src/components/ui/loader'
import { removeSymbols } from 'src/lib/utils'

const useGetUser = createGetQueryHook({
  endpoint: '/users/me',
  responseSchema: userSchema,
  queryKey: ['user'],
})

export default function AccountTab() {
  const { data: user, isLoading, isError } = useGetUser()

  if (isLoading) {
    return <Loader type="spinner" />
  }

  if (isError) {
    return <Text>Error loading user details.</Text>
  }

  const profile = [
    { label: 'First Name', value: user.firstName },
    { label: 'Email', value: user.email },
    { label: 'Phone Number', value: user.phone },
    { label: 'Last Name', value: user.lastName },
    { label: 'Role', value: removeSymbols(user.role) },
    { label: 'Address', value: user.address ?? 'No address' },
  ]

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Profile</Text>
        <ProfileDialog current_user={user} />
      </FlexBox>
      <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
        {profile.map((item) => (
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
      <div className="w-full py-4">
        <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
          <Text className="text-xl font-semibold text-neutral-700">Password Authentication</Text>
          <PasswordDialog />
        </FlexBox>
      </div>
    </FlexBox>
  )
}
