import { DataTable } from 'src/components/ui/data-table'
import { createColumns } from '../../permissions-table/columns'
import { ModulePermissions } from '../../../types'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'

type Permissions = {
  module: string
  access: boolean
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

const initialPermissions: Permissions[] = [
  { module: 'userManagement', access: false, view: false, create: false, edit: false, delete: false },
  { module: 'clusterManagement', access: false, view: false, create: false, edit: false, delete: false },
  { module: 'systemConfig', access: false, view: true, create: false, edit: false, delete: false },
  { module: 'pondSetup', access: true, view: false, create: true, edit: false, delete: false },
  { module: 'batchSetup', access: false, view: false, create: false, edit: false, delete: false },
  { module: 'farmReport', access: false, view: false, create: true, edit: false, delete: false },
  { module: 'sampling', access: false, view: false, create: false, edit: false, delete: false },
  { module: 'harvestReport', access: false, view: false, create: true, edit: false, delete: false },
  { module: 'reportingAnalytics', access: false, view: true, create: false, edit: false, delete: false },
  { module: 'maintenance', access: true, view: false, create: false, edit: false, delete: false },
]

export default function ClusterManagerPermissions() {
  // Set permissions with state
  const handleToggle = (module: string, type: keyof ModulePermissions, value: boolean) => {
    console.log({ module, type, value })
  }

  const columns = createColumns({ handleToggle })

  // Get permissions data, pass role to update and save chang

  return (
    <FlexBox gap="gap-6" direction="col">
      <DataTable columns={columns} data={initialPermissions} search={false} />
      <FlexBox justify="between" className="w-full">
        <Text size="sm" className="rounded-lg border border-neutral-200 px-[6px] py-[3px]">
          Last updated by Jane Smith on May 6, 2025
        </Text>
        <Button variant="primary">Save Changes</Button>
      </FlexBox>
    </FlexBox>
  )
}
