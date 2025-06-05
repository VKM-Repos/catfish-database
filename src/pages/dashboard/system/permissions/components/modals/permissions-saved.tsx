import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'

export default function PermissionsSavedModal() {
  return (
    <Dialog open={false}>
      <DialogContent className="max-w-[478px] overflow-hidden p-8">
        <div className="flex h-[3rem] w-full flex-col items-center justify-center space-y-4">
          <Heading level={6}>Completed!</Heading>
          <Text weight="light" size="base">
            Permissions updated successfully!
          </Text>
          <Button variant="primary">Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
