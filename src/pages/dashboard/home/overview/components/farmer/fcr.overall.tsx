import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Card, CardContent } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import z from 'zod'

type DateRange = { from: Date; to: Date }
interface FcrOverallProps {
  dateRange?: DateRange
}

export default function FcrOverall({ dateRange }: FcrOverallProps) {
  const useGetFcr = createGetQueryHook({
    endpoint: '/dashboards/farmer/fcr/overall',
    responseSchema: z.any(),
    queryKey: ['fcr-overall'],
  })
  const { data: fcr } = useGetFcr({
    query: {
      interval: 'ALL',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })
  return (
    <Card className="flex h-[400px] max-h-[400px] min-h-[400px] w-full items-center p-[24px]">
      <div className="flex w-full flex-col">
        <CardContent>
          <FlexBox className="mt-[20px] w-full" direction="col">
            <FlexBox className="mt-[20px] w-full" direction="row">
              <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
                <Text className="font-medium leading-[20px]">Feed Conversion Ratio</Text>
                <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.fcrValue : 0}</Text>
                <Text className="text-[10px] font-medium text-success-500">Good</Text>
              </div>
              <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
                <Text className="font-medium leading-[20px]">Feed Cost</Text>
                <Text className="text-[16px] font-semibold">₦{fcr ? fcr[0]?.totalWeightGained : 0}</Text>
                <Text className="text-[10px] font-medium text-[#000AFF]">₦5.5 per kg</Text>
              </div>
            </FlexBox>

            <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-100 p-[10px]">
              <Text className="font-medium leading-[20px]">Total Feed Consumed</Text>
              <Text className="text-[16px] font-semibold">{fcr ? fcr[0]?.totalFeedConsumed : 0} kg</Text>
              <Text className="text-[10px] font-medium">For current production cycle</Text>
            </div>
          </FlexBox>
        </CardContent>
      </div>
    </Card>
  )
}
