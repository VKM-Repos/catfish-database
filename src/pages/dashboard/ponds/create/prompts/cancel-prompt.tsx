import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogTitle, DialogContent, DialogDescription } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'

type CancelPromptProps = {
  openCancelPrompt: boolean
  setOpenCancelPrompt: (openCancelPrompt: boolean) => void
  handleCancelYes: () => void
  handleCancelNo: () => void
}

export default function CancelPrompt({
  openCancelPrompt,
  setOpenCancelPrompt,
  handleCancelYes,
  handleCancelNo,
}: CancelPromptProps) {
  return (
    <Dialog open={openCancelPrompt} onOpenChange={setOpenCancelPrompt}>
      <DialogContent className="max-h-fit w-fit overflow-hidden px-[2.5rem] py-[3.75rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]">
        <VisuallyHidden>
          <DialogTitle>Cancel current process</DialogTitle>
          <DialogDescription>This prompt cancels this process and loses unsaved changes</DialogDescription>
        </VisuallyHidden>
        <FlexBox direction="col" justify="between" gap="gap-[3.25rem]" align="center">
          <FlexBox direction="col" gap="gap-2" align="start">
            <Heading level={5} weight="bold">
              Cancel
            </Heading>
            <Text>You are about to cancel this process, unsaved changes will be lost.</Text>
          </FlexBox>
          <FlexBox gap="gap-3" className="w-full">
            <Button variant="outline" onClick={handleCancelYes} className="w-full font-semibold">
              Yes, cancel
            </Button>
            <Button variant="primary" onClick={handleCancelNo} className="w-full font-semibold">
              No, Continue
            </Button>
          </FlexBox>
        </FlexBox>
      </DialogContent>
    </Dialog>
  )
}
