import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import { UpdateFeedingReportForm } from './update-feeding-report-form'
import { UpdateWaterQuality } from './water-quality'
import { UpdateFishBehavior } from './fish-behavior'
import { UpdateFishDIsease } from './fish-disease'
import { UpdateMortality } from './mortality'
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
  const handleGoBack = () => {
    navigate(`${paths.dashboard.reports.root}`)
  }
  const RenderSteps = () => {
    switch (step) {
      case '1':
        return <UpdateFeedingReportForm />
      case '2':
        return <UpdateWaterQuality handleGoBack={handleGoBack} />
      case '3':
        return <UpdateFishBehavior handleGoBack={handleGoBack} />
      case '4':
        return <UpdateFishDIsease handleGoBack={handleGoBack} />
      case '5':
        return <UpdateMortality handleGoBack={handleGoBack} />
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
