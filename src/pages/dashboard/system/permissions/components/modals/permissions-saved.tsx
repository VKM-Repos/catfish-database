import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'

export default function PermissionsSavedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[478px] overflow-hidden p-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <Heading level={6}>Completed!</Heading>
          <Text weight="light" size="base">
            Permissions updated successfully!
          </Text>
          <Button variant="primary" onClick={onClose}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
