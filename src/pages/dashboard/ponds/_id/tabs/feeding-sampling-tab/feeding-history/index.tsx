import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { useParams } from 'react-router-dom'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedFeedingResponseSchema } from 'src/schemas'
import { Heading } from 'src/components/ui/heading'

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

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox direction="row" align="center" justify="between" className="w-full">
        <Heading level={6}>Feeding history</Heading>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={feedings?.content ?? []}
        isLoading={isLoading}
        emptyStateMessage="No feeding history found"
      />
    </FlexBox>
  )
}
