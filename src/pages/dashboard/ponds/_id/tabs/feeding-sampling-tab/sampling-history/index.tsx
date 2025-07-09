import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'

export default function SamplingHistory() {
  const useGetSamplings = createGetQueryHook({
    endpoint: '/samplings',
    responseSchema: z.any(),
    queryKey: ['samplings'],
  })

  const { data: samplings, isLoading } = useGetSamplings()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox direction="row" align="center" justify="between" className="w-full">
        <Heading level={6}>Sampling history</Heading>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={samplings?.content ?? []}
        isLoading={isLoading}
        emptyStateMessage="No sampling history found"
      />
    </FlexBox>
  )
}
