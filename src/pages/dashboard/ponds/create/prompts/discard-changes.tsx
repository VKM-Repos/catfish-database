import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'

/**
 * Prompt for discarding unsaved work.
 * - **open** / **setOpen** control the modal state.
 * - **originPath** is where the user should return if they cancel.
 */
export type DiscardChangesProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onDiscard?: () => void // optional extra effect (e.g. mutate state, toast)
}

export default function DiscardChanges({ open, setOpen, onDiscard }: DiscardChangesProps) {
  const handleDiscard = () => {
    onDiscard?.()
    // navigate(originPath)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-fit w-fit overflow-hidden px-[2.5rem] py-[3.75rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Discard unsaved changes</DialogTitle>
          <DialogDescription>Leave the form and lose any progress.</DialogDescription>
        </VisuallyHidden>

        <FlexBox direction="col" justify="between" gap="gap-[3.25rem]" align="center">
          <FlexBox direction="col" gap="gap-2" align="start">
            <Heading level={5} weight="bold">
              Discard changes?
            </Heading>
            <Text>You are about to leave this form. All unsaved data will be lost.</Text>
          </FlexBox>

          <FlexBox gap="gap-3" className="w-full">
            <Button variant="outline" onClick={handleDiscard} className="w-full font-semibold">
              Yes, discard
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)} className="w-full font-semibold">
              No, stay
            </Button>
          </FlexBox>
        </FlexBox>
      </DialogContent>
    </Dialog>
  )
}
