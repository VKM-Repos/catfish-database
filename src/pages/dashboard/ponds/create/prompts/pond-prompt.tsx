import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'

/**
 * Highly‑configurable modal prompt.
 * Supports one mandatory action + one optional fallback.
 */
export type PondPromptProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  message?: string
  primaryText?: string
  primaryAction: () => void
  secondaryText?: string
  secondaryAction?: () => void
  hideSecondary?: boolean
}

export default function PondPrompt({
  open,
  setOpen,
  title = 'Action completed!',
  message = 'Would you like to continue?',
  primaryText = 'Continue',
  primaryAction,
  secondaryText = 'Maybe later',
  secondaryAction,
  hideSecondary = false,
}: PondPromptProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-fit w-fit overflow-hidden px-[2.5rem] py-[3.75rem] shadow-[0px_4px_16px_-8px_#0F4B2F29]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Prompt</DialogTitle>
          <DialogDescription>Reusable modal prompt component</DialogDescription>
        </VisuallyHidden>

        <FlexBox direction="col" justify="between" gap="gap-[3.25rem]" align="center">
          <FlexBox direction="col" gap="gap-2" align="center">
            <Heading level={5} weight="bold">
              {title}
            </Heading>
            <Text className="text-center">{message}</Text>
          </FlexBox>

          <FlexBox direction="col" gap="gap-3" className="w-full">
            <Button variant="primary" onClick={primaryAction} className="w-full font-semibold">
              {primaryText}
            </Button>

            {!hideSecondary && secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction} className="w-full font-semibold text-primary-500">
                {secondaryText}
              </Button>
            )}
          </FlexBox>
        </FlexBox>
      </DialogContent>
    </Dialog>
  )
}
