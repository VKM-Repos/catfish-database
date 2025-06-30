import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { paginatedConfigResponseSchema } from 'src/schemas/configurationSchema'

export default function ConfigurationTable() {
  const useGetConfigsLog = createGetQueryHook({
    endpoint: '/configurations?direction=ASC',
    responseSchema: paginatedConfigResponseSchema,
    queryKey: ['configurations'],
  })
  // const { data: confis, isLoading } = useGetConfigsLog()
  const configs = [
    {
      key: 'Feed Schedule',
      listValue: ['Morning', 'Afternoon'],
      type: 'List',
      category: 'Feeding',
      updatedAt: '2025-05-26T14:57:00.717336',
    },
    {
      key: 'Water Temperature Range',
      listValue: ['22-30C'],
      type: 'Range',
      category: 'Maintenance',
      updatedAt: '2025-05-26T14:57:00.717336',
    },
    {
      key: 'Default Password',
      listValue: ['Password@111'],
      type: 'Text',
      category: 'Security',
      updatedAt: '2025-05-26T14:57:00.717336',
    },
    {
      key: 'Reporting Frenquency',
      listValue: ['Daily', 'Weekly', 'Monthly'],
      type: 'Select',
      category: 'Reporting',
      updatedAt: '2025-05-26T14:57:00.717336',
    },
  ]
  // console.log('confis: ', confis?.content)
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <DataTable columns={columns} data={configs || []} isLoading={false} emptyStateMessage="No Configuration found" />
    </FlexBox>
  )
}
