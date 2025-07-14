import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes'

type CreateReportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resetForm: () => void
}

export function UpdateReportDialog({ open, onOpenChange, resetForm }: CreateReportDialogProps) {
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate(`${paths.dashboard.reports.root}`)
  }
  return (
    <Dialog open={open}>
      <DialogContent className="overflow-hidden p-8">
        <div className="my-5">
          <h2 className="text-center text-[2rem] font-semibold">Updated!</h2>
          <p className="text-center">Your report has been updated?</p>
        </div>
        {/* <Button onClick={addReport}>Yes, submit another report</Button> */}
        <Button type="button" onClick={handleCancel} variant="link" className="font-semibold text-primary-500">
          Go back to reports page
        </Button>
      </DialogContent>
    </Dialog>
  )
}
