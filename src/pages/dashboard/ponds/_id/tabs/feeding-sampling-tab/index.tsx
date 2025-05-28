import { FlexBox } from 'src/components/ui/flexbox'
import SamplingHistory from './sampling-history'
import FeedingHistory from './feeding-history'

export default function FeedingSamplingLogs() {
  return (
    <FlexBox direction="col" gap="gap-20" className="w-full">
      <SamplingHistory />
      <FeedingHistory />
    </FlexBox>
  )
}
