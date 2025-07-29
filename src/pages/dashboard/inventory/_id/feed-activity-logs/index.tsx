import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { paths } from 'src/routes/paths'
import FeedActivityLogsTable from './table'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import { useState } from 'react'

const useGetFeedActivityLogs = createGetQueryHook({
  endpoint: `/feed-inventories/:id/feed-logs`,
  responseSchema: z.any(),
  queryKey: ['feeding-activity-logs'],
})

export default function FeedActivityLogsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1),
    to: new Date(),
  })

  const location = useLocation()
  const item = location.state?.item

  const { data, isLoading } = useGetFeedActivityLogs({
    route: { id: id! },
    query: {
      direction: 'DESC',
      startDate: dateRange.from.toISOString().split('T')[0],
      endDate: dateRange.to.toISOString().split('T')[0],
    },
  })

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
  }

  if (!id) return null

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.inventory.root)}>
      <DialogContent className="max-h-[90dvh] min-h-[410px] min-w-[80%] overflow-scroll px-8 py-4">
        <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
          <FlexBox justify="center" align="center" className="w-full">
            <Text className="text-xl font-semibold text-neutral-700">Feed Activity Log</Text>
          </FlexBox>
        </div>
        <FlexBox gap="gap-unset" justify="between" align="center" className="w-full pt-[3rem]">
          <div className="flex h-fit w-full items-center justify-end bg-white py-4">
            <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="w-auto" />
          </div>
        </FlexBox>
        <FeedActivityLogsTable data={data} isLoading={isLoading} item={item} />
      </DialogContent>
    </Dialog>
  )
}
