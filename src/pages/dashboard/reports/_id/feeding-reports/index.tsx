import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { paths } from 'src/routes/paths'
import { Grid } from 'src/components/ui/grid'
import { FlexBox } from 'src/components/ui/flexbox'
import { z } from 'zod'
import { formatDate } from 'src/lib/date'
import { Button } from 'src/components/ui/button'

const useGetFeedingReports = createGetQueryHook({
  endpoint: '/feeding-water-qualities/:id',
  responseSchema: z.any(),
  queryKey: ['feeding-water-quality-details'],
})

export default function FeedingReportsDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useGetFeedingReports({ route: { id: id! } })

  if (!id) return null

  const feedingReports = [
    { label: 'Date', value: data?.createdAt ? formatDate(data?.createdAt) : '-' },
    { label: 'Feed Type', value: data?.feedType ?? '-' },
    { label: 'Pellet Size', value: data?.pelletSize ?? '-' },
    { label: 'Feed Quantity', value: data?.quantity ?? '-' },
    { label: 'Feeding Frequency', value: data?.feedFrequency ?? '-' },
    { label: 'Observation', value: data?.observation ?? '-' },
  ]

  const waterQuality = [
    { label: 'pH Level', value: data?.phLevel },
    { label: 'Dissolved Oxygen', value: data?.dissolvedOxygen },
    { label: 'Temperature', value: data?.temperature },
    { label: 'Ammonia', value: data?.ammonia },
    { label: 'Nitrate', value: data?.nitrate },
    { label: 'Alkalinity', value: data?.alkalinity },
    { label: 'Hardness', value: data?.hardness },
  ].filter((item) => item.value !== null && item.value !== undefined) // remove null/undefined

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.reports.root)}>
      <DialogContent className="min-h-[410px] min-w-[740px] overflow-hidden px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : data ? (
          <FlexBox direction="col" gap="gap-6" className="w-full py-4">
            <FlexBox justify="center" align="center" className="w-full">
              <Text className="text-xl font-semibold text-neutral-700">View Record</Text>
            </FlexBox>

            <Text className="w-full border-b border-b-neutral-200 text-base font-semibold text-neutral-700">
              Feeding
            </Text>
            <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
              {feedingReports.map((item) => (
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

            {waterQuality.length > 0 && (
              <>
                <Text className="w-full border-b border-b-neutral-200 text-base font-semibold text-neutral-700">
                  Water Quality
                </Text>
                <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
                  {waterQuality.map((item) => (
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
              </>
            )}
            <div className="mt-6 flex w-full justify-between space-x-2">
              <Button className="w-full" variant="outline" onClick={() => navigate(paths.dashboard.reports.root)}>
                Cancel
              </Button>
              <Button
                className="w-full"
                variant="primary"
                onClick={() => navigate(paths.dashboard.reports.editFeedingReport(id))}
              >
                Edit
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
