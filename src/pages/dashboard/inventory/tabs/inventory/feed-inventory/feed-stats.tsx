import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Grid } from 'src/components/ui/grid'
import { formatPrice } from 'src/lib/utils'

export default function FeedStatistics({ totalFeedTypes, totalFeedCost, lowStockFeeds }: any) {
  const feed_inventory_stats = [
    {
      color: '#A0E8B9',
      label: 'Total feed types',
      value: `${totalFeedTypes ?? 0}`,
    },
    {
      color: '#F8D082',
      label: 'Total feed cost in inventory',
      value: `${formatPrice(totalFeedCost) ?? '₦0'}`,
    },
    {
      color: '#F1A8D3',
      label: 'Low stock feeds',
      value: `${lowStockFeeds ?? 0}`,
    },
  ]
  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid gap="gap-5" className=" w-full grid-cols-2 text-sm md:grid-cols-3">
        {feed_inventory_stats.map((feed_stat, index) => {
          return (
            <div
              key={index}
              style={{ backgroundColor: feed_stat.color }}
              className={`rounded-lg px-5 py-[1.875rem] ${index == 2 && 'col-span-2 lg:col-span-1'}`}
            >
              <FlexBox gap="gap-[1.125rem]" direction="col">
                <Text className="text-xs text-[#37414F]">{feed_stat.label}</Text>
                <FlexBox direction="col" gap="gap-3">
                  <Text className="!text-[1.5rem] font-bold text-[#1F2937]">{feed_stat.value}</Text>
                </FlexBox>
              </FlexBox>
            </div>
          )
        })}
      </Grid>
    </FlexBox>
  )
}

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
