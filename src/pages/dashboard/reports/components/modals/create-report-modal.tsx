import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes'

type CreateReportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resetForm: () => void
}

export function CreateReportDialog({ open, onOpenChange, resetForm }: CreateReportDialogProps) {
  const navigate = useNavigate()

  const handleCancel = () => {
    onOpenChange(false)
    navigate(paths.dashboard.home.getStarted)
    resetForm()
  }
  return (
    <Dialog open={open}>
      <DialogContent className="overflow-hidden p-8">
        <div className="my-5">
          <h2 className="text-center text-[2rem] font-semibold">Recorded!</h2>
          <p className="text-center">
            Your report for today has been captured, do you want to submit another one today?
          </p>
        </div>
        <Button>Yes, submit another report</Button>
        <Button type="button" onClick={handleCancel} variant="link" className="font-semibold text-primary-500">
          No , I will do this later
        </Button>
      </DialogContent>
    </Dialog>
  )
}
