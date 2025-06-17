import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
// import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import FeedStatistics from './feed-stats'
import FeedPriceTrends from './feed-price-trends'
import { Section } from 'src/components/ui/section'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

export default function FeedInventory() {
  const navigate = useNavigate()
  const useGetFeedInventories = createGetQueryHook({
    endpoint: '/feed-inventories',
    responseSchema: z.any(),
    queryKey: ['feed-inventories'],
  })

  const { data: feedInventories, isLoading } = useGetFeedInventories()

  const title = 'Feed inventory'
  const actions = (
    <Inline>
      <Button
        variant="primary"
        className="flex items-center gap-2"
        onClick={() => navigate(paths.dashboard.inventory.createFeedStock('inventory'))}
      >
        <SolarIconSet.AddCircle size={20} />
        <Text>Add feed stock</Text>
      </Button>
    </Inline>
  )

  return (
    <>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <FeedStatistics />
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          <div>{actions}</div>
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={feedInventories?.content ?? []}
          isLoading={isLoading}
          emptyStateMessage="No feed inventory found"
        />
      </FlexBox>
      <Section className="mt-6">
        <FeedPriceTrends />
      </Section>
    </>
  )
}
