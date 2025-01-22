import { FlexBox } from 'src/components/layouts/flexbox'
import { Grid } from 'src/components/layouts/grid'
import { Text } from 'src/components/layouts/text'
import ProfileDialog from './profile-dialog'
import PasswordDialog from './password-dialog'

const profile = [
  { label: 'First Name', value: 'Adegoke' },
  { label: 'Email', value: 'adegokbell@gmail.com' },
  { label: 'Middle Name', value: 'Bello' },
  { label: 'Phone Number', value: '09012345678' },
  { label: 'Last Name', value: 'Daniel' },
  { label: 'Role', value: 'Super admin' },
]

export default function AccountTab() {
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Profile</Text>
        <ProfileDialog />
      </FlexBox>
      <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
        {profile.map((item) => (
          <FlexBox key={item.label} gap="gap-2" direction="col">
            <Text variant="body" className="font-semibold">
              {item.label}
            </Text>
            <Text variant="body">{item.value}</Text>
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
