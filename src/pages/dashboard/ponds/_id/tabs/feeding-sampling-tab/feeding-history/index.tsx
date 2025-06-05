import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useParams } from 'react-router-dom'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedFeedingResponseSchema } from 'src/schemas'
import { Loader } from 'src/components/ui/loader'

export default function FeedingHistory() {
  const { id } = useParams<{ id: string }>()

  const useGetFeedings = createGetQueryHook({
    endpoint: '/feedings',
    responseSchema: paginatedFeedingResponseSchema,
    queryKey: ['feedings'],
  })

  const { data: feedings, isLoading } = useGetFeedings({
    query: { pondId: id },
  })

  if (isLoading) return <Loader type="spinner" />

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Feeding history</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={feedings?.content ?? []}
        isLoading={false}
        emptyStateMessage="No feeding history found"
      />
    </FlexBox>
  )
}
