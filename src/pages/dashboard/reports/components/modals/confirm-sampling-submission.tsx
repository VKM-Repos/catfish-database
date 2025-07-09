import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'

type CreateReportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmSamplingSubmission({ open, onOpenChange }: CreateReportDialogProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }
  const addReport = () => {
    onOpenChange(true)
  }
  return (
    <Dialog open={open}>
      <DialogContent className="overflow-hidden p-8">
        <div className="my-5">
          <h2 className="text-center text-[2rem] font-semibold text-error-500">Warning!!</h2>
          <p className="text-center">
            Once you submit this sampling report, you will not be able to make any changes to it. Please review all the
            details carefully before proceeding.
          </p>
        </div>
        <Button onClick={addReport}>Submit report</Button>
        <Button type="button" onClick={handleCancel} variant="link" className="font-semibold text-primary-500">
          Go Back to Edit
        </Button>
      </DialogContent>
    </Dialog>
  )
}
