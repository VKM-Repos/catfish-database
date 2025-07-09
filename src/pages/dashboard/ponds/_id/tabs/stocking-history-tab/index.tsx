import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Inline } from 'src/components/ui/inline'
import { Spacer } from 'src/components/ui/spacer'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes/paths'
import { DataTable } from 'src/components/ui/data-table'
import { columns } from './table/columns'
import EmptyTableState from 'src/components/global/empty-state'
import EmptyClusterManagerImg from 'src/assets/images/empty-cluster-manager.jpg'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Heading } from 'src/components/ui/heading'
import { FlexBox } from 'src/components/ui/flexbox'
import { z } from 'zod'

export default function StockingHistory() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const openCreateModal = () => {
    navigate(paths.dashboard.ponds.create.addFishToPond)
  }

  const useGetFishBatches = createGetQueryHook({
    endpoint: `/fish-batches`,
    responseSchema: z.any(),
    queryKey: ['my-fish-batches'],
  })

  const { data: fishBatches, isLoading } = useGetFishBatches({
    query: { pondId: id },
  })

  const actions = fishBatches && fishBatches?.content.length > 0 && (
    <Inline>
      <Button variant="outline" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text weight="semibold">Add new batch</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative pb-[5rem]">
      <FlexBox direction="row" align="center" justify="between" className="w-full">
        <Heading level={6}>Stocking history</Heading>
        {actions}
      </FlexBox>
      <Spacer />
      <>
        {(fishBatches && fishBatches?.content.length > 0) || isLoading ? (
          <DataTable
            search={false}
            columns={columns}
            data={fishBatches?.content ?? []}
            isLoading={isLoading}
            emptyStateMessage="No stocking history found"
          />
        ) : (
          <EmptyTableState
            image={EmptyClusterManagerImg}
            name="new batch"
            text="new batch"
            buttonFunc={openCreateModal}
          />
        )}
      </>
      <Outlet />
    </div>
  )
}
