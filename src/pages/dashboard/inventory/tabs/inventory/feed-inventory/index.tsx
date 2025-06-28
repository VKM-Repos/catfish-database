import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
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
import { Container } from 'src/components/ui/container'

const feedQuantitySchema = z.array(
  z.object({
    intervalLabel: z.string(),
    feedType: z.string(),
    sizeInMm: z.number(),
    totalQuantity: z.number(),
  }),
)

export default function FeedInventory() {
  const navigate = useNavigate()
  const LOW_STOCK_THRESHOLD = 500

  // Fetch feed inventories as before
  const useGetFeedInventories = createGetQueryHook({
    endpoint: '/feed-inventories',
    responseSchema: z.any(),
    queryKey: ['feed-inventories'],
  })

  // Fetch feed quantity stats
  const useGetFeedQuantity = createGetQueryHook({
    endpoint: '/dashboards/farmer/feed-quantity?interval=DAILY',
    responseSchema: feedQuantitySchema,
    queryKey: ['feed-quantity'],
  })
  const useGetFeedStatistics = createGetQueryHook({
    endpoint: `/dashboards/farmer/feed/total?interval=ALL`,
    responseSchema: z.any(),
    queryKey: ['feed-statistics'],
  })
  const useGetLowStockFeeds = createGetQueryHook({
    endpoint: `/dashboards/farmer/inventory/low-stock?threshold=${LOW_STOCK_THRESHOLD}`,
    responseSchema: z.any(),
    queryKey: ['low-stock-feeds'],
  })

  const { data: feedStatistics } = useGetFeedStatistics()
  const { data: feedInventories, isLoading } = useGetFeedInventories()
  const { data: feedQuantity } = useGetFeedQuantity()
  const { data: lowStockFeeds } = useGetLowStockFeeds()

  const totalFeedCost = feedStatistics?.totalCost ?? '₦0'
  // Calculate total feed types (unique feedType)
  const totalFeedTypes = feedQuantity ? Array.from(new Set(feedQuantity.map((item) => item.feedType))).length : 0

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
    <Container>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <FeedStatistics
          totalFeedTypes={totalFeedTypes}
          lowStockFeeds={Array.isArray(lowStockFeeds) ? lowStockFeeds.length : 0}
          totalFeedCost={totalFeedCost}
        />
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
    </Container>
  )
}
