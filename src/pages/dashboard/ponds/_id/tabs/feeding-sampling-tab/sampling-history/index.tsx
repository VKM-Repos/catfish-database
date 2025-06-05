import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { z } from 'zod'

export default function SamplingHistory() {
  const useGetSamplings = createGetQueryHook({
    endpoint: '/samplings',
    responseSchema: z.any(),
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
