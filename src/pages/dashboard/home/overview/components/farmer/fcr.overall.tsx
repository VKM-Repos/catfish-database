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
    <Card className="flex h-[400px] max-h-[400px] min-h-[400px] w-1/2 border-neutral-200">
      <div className="flex h-full w-full flex-col py-5">
        <CardContent className="flex-1">
          <FlexBox className="my-[20px] h-full w-full" direction="col">
            <FlexBox className="  w-full flex-1" direction="row">
              <div className="flex h-full w-full flex-col justify-center gap-2 rounded-md border-2 border-neutral-100 p-[10px]">
                <Text className="text-lg font-medium leading-[20px]">Feed Conversion Ratio</Text>
                <Text className="text-xl font-semibold">{fcr ? fcr[0]?.fcrValue : 0}</Text>
                <Text className="text-sm font-medium text-success-500">Good</Text>
              </div>
              <div className="flex h-full w-full flex-col justify-center gap-2 rounded-md border-2 border-neutral-100 p-[10px]">
                <Text className="text-lg font-medium leading-[20px]">Feed Cost</Text>
                <Text className="text-xl font-semibold">₦{fcr ? fcr[0]?.totalWeightGained : 0}</Text>
                <Text className="text-sm font-medium text-[#000AFF]">₦5.5 per kg</Text>
              </div>
            </FlexBox>

            <div className="flex w-full flex-1 flex-col justify-center gap-2 rounded-md border-2 border-neutral-100 p-[10px]">
              <Text className="text-lg font-medium leading-[20px]">Total Feed Consumed</Text>
              <Text className="text-xl font-semibold">{fcr ? fcr[0]?.totalFeedConsumed : 0} kg</Text>
              <Text className="text-sm font-medium">For current production cycle</Text>
            </div>
          </FlexBox>
        </CardContent>
      </div>
    </Card>
  )
}
