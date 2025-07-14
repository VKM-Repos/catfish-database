import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { UpdateFeedingReportForm } from './update-feeding-report-form'
type Params = {
  id: string
  step: string
}
export default function EditFeedingReportPage() {
  const { id } = useParams<Params>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const step = searchParams.get('step')

  if (!id) {
    return null
  }

  const RenderSteps = () => {
    switch (step) {
      case '1':
        return <UpdateFeedingReportForm />
      case '2':
        return <div>Water quality</div>
      case '3':
        return <div>FIsh behavior</div>
      case '4':
        return <div>Fish disease</div>
      case '5':
        return <div>Mortality</div>
      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.reports.root)}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="max-h-[80vh] max-w-[60%] overflow-y-scroll p-8"
      >
        <RenderSteps />
      </DialogContent>
    </Dialog>
  )
}
