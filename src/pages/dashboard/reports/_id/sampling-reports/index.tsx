import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { paths } from 'src/routes/paths'

export default function FeedingReportsDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useLocation()

  const samplingData = state?.samplingData
  const samplingReport = [
    { label: 'Date', value: samplingData?.createdAt ? formatDate(samplingData?.createdAt) : '-' },
    { label: 'Number of Fish Sampled', value: samplingData?.sample ?? '-' },
    { label: 'Weight of Fish Sampled', value: samplingData?.weight ?? '-' },
    { label: 'Avg. Weight of Fish Sampled', value: samplingData?.averageWeightToFish ?? '-' },
    { label: 'Total Weight gain', value: samplingData?.weightGain ?? '-' },
    { label: 'Mortality', value: samplingData?.mortality ?? '-' },
    { label: 'Disease', value: samplingData?.diseaseType ?? '-' },
    { label: 'Disease Observation', value: samplingData?.diseaseObserve ?? '-' },
    { label: 'Behavior', value: samplingData?.behaviorType ?? '-' },
    { label: 'Behavior Observation', value: samplingData?.behaviourObserve ?? '-' },
  ]
  if (!id) return null

  return (
    <Dialog open={true} onOpenChange={() => navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)}>
      <DialogContent className="min-h-[410px] min-w-[740px] overflow-hidden px-8 py-4">
        {state?.samplingData ? (
          <FlexBox direction="col" gap="gap-6" className="w-full py-4">
            <FlexBox justify="center" align="center" className="w-full">
              <Text className="text-xl font-semibold text-neutral-700">View Record</Text>
            </FlexBox>

            <Text className="w-full border-b border-b-neutral-200 text-base font-semibold text-neutral-700">
              Sampling
            </Text>
            <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
              {samplingReport.map((item) => (
                <FlexBox key={item.label} gap="gap-2" direction="col">
                  <Text variant="body" size="base" color="text-neutral-500" weight="semibold">
                    {item.label}
                  </Text>
                  <Text variant="body" size="base" color="text-neutral-500" weight="light">
                    {item.value}
                  </Text>
                </FlexBox>
              ))}
            </Grid>
            <div className="mt-6 flex w-full justify-between space-x-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`${paths.dashboard.reports.root}?tab=sampling-report`)}
              >
                Cancel
              </Button>
            </div>
          </FlexBox>
        ) : (
          <Text>Data not found</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}
