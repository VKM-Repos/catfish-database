import { useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import SamplingHistory from './sampling-history'
import FeedingHistory from './feeding-history'
import HarvestRecords from './harvest-records'

export default function FeedingSamplingLogs() {
  const { id } = useParams<{ id: string }>()

  return (
    <FlexBox direction="col" gap="gap-20" className="w-full">
      <SamplingHistory />
      <FeedingHistory />
      <HarvestRecords />
    </FlexBox>
  )
}
