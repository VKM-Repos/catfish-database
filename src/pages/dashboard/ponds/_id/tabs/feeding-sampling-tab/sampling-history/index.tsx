import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedSamplingResponseSchema } from 'src/schemas'
import { Loader } from 'src/components/ui/loader'

export default function SamplingHistory() {
  const useGetSamplings = createGetQueryHook({
    endpoint: '/samplings',
    responseSchema: paginatedSamplingResponseSchema,
    queryKey: ['samplings'],
  })

  const { data: samplings, isLoading } = useGetSamplings()

  if (isLoading) return <Loader type="spinner" />

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Sampling history</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={samplings?.content ?? []}
        isLoading={false}
        emptyStateMessage="No sampling history found"
      />
    </FlexBox>
  )
}

export const samplingHistory = [
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: true,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: 'Harvest',
  },
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: true,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: 'Transfer',
  },
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: false,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: '-',
  },
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: false,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: '-',
  },
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: false,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: '-',
  },
  {
    date: '02/04/2025',
    fishPopulation: '2500',
    sampleSize: '30',
    averageWeight: '340g',
    averageWeightGain: '1.5mm',
    mortality: '5',
    splitTriggered: false,
    fishMoved: '500',
    destinationPond: 'Back Tank',
    reason: '-',
  },
]
