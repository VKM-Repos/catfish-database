import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

export default function FeedingHistory() {
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Feeding history</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={feedingHistory ?? []}
        isLoading={false}
        emptyStateMessage="No feeding history found"
      />
    </FlexBox>
  )
}

const feedingHistory = [
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
  {
    date: '02/04/2025',
    feedType: 'Topfeed 4mm',
    quantityType: '25',
    feedingTime: '2',
  },
]
