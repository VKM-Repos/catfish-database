import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import ChangeSystemPasswordDialog from '../dialogs/system-default-password'

export default function SystemPasswordTab() {
  return (
    <div className="w-full py-4">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">System Default Password</Text>
        <ChangeSystemPasswordDialog />
      </FlexBox>
    </div>
  )
}
