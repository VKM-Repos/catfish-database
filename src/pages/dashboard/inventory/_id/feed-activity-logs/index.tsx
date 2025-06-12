import { useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import FeedActivityLogsTable from './table'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { FlexBox } from 'src/components/ui/flexbox'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

const useGetFeedActivityLogs = createGetQueryHook({
  endpoint: '/feed-inventories/:id/logs',
  responseSchema: z.any(),
  queryKey: ['feeding-activity-logs'],
})

export default function FeedActivityLogsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useGetFeedActivityLogs({ route: { id: id! } })

  if (!id) return null

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.inventory.root)}>
      <DialogContent className="min-h-[410px] min-w-[80%] overflow-scroll px-8 py-4">
        <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
          <FlexBox justify="center" align="center" className="w-full">
            <Text className="text-xl font-semibold text-neutral-700">Feed Activity Log</Text>
          </FlexBox>
        </div>
        <FlexBox gap="gap-unset" justify="between" align="center" className="mt-8 w-full">
          <Button
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
          >
            <Text size="sm" weight="light">
              May 21 - 27, 2024
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </Button>
          <Button
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-primary-500 text-primary-500"
          >
            <SolarIconSet.Download color="currentColor" size={20} iconStyle="Outline" />
            <Text size="sm" weight="light">
              Export CSV file
            </Text>
          </Button>
        </FlexBox>
        <FeedActivityLogsTable data={data} />
      </DialogContent>
    </Dialog>
  )
}
