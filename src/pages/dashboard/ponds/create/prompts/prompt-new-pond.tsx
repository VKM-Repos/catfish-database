import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'

type PromptProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handleYesConditionOnClose: () => void
  handleNoConditionOnClose: () => void
  pondCreated: boolean
}

export default function PromptNewPond({
  open,
  setOpen,
  handleYesConditionOnClose,
  handleNoConditionOnClose,
  pondCreated,
}: PromptProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-fit w-fit overflow-hidden px-[2.5rem] py-[3.75rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Prompt new pond?</DialogTitle>
          <DialogDescription>
            This popup allows you to either start a new process to add a pond or leave the page
          </DialogDescription>
        </VisuallyHidden>
        <FlexBox direction="col" justify="between" gap="gap-[3.25rem]" align="center">
          <FlexBox direction="col" gap="gap-2" align="center">
            <Heading level={5} weight="bold">
              Success! Pond created
            </Heading>
            <Text className="text-center">
              Would you like to add another pond? You can always create additional ponds later from your dashboard
            </Text>
          </FlexBox>
          <FlexBox direction="col" gap="gap-3" className="w-full">
            <Button variant="primary" onClick={handleYesConditionOnClose} className="w-full font-semibold">
              Yes, add another pond
            </Button>
            <Button
              variant="ghost"
              onClick={handleNoConditionOnClose}
              className="w-full font-semibold text-primary-500"
            >
              {pondCreated ? 'No, I will do that later' : 'Add fish to pond'}
            </Button>
          </FlexBox>
        </FlexBox>
      </DialogContent>
    </Dialog>
  )
}
