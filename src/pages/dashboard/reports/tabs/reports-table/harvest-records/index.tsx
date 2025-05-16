import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { samplingHistory } from '../sampling-history'

export default function HarvestReportsTable() {
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Harvest Reports</Text>
      </FlexBox>
      <DataTable
        search={false}
        columns={columns}
        data={samplingHistory ?? []}
        isLoading={false}
        emptyStateMessage="No Harvest report found"
      />
    </FlexBox>
  )
}
