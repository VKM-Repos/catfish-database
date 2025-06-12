import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Grid } from 'src/components/ui/grid'

export default function FeedStatistics() {
  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={3} gap="gap-5" className="w-full text-sm md:grid-cols-3">
        {feed_inventory_stats.map((feed_stat, index) => {
          return (
            <div key={index} style={{ backgroundColor: feed_stat.color }} className={`rounded-lg px-5 py-[1.875rem]`}>
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

const feed_inventory_stats = [
  {
    color: '#A0E8B9',
    label: 'Total feed types',
    value: '3',
  },
  {
    color: '#F8D082',
    label: 'Total feed cost in inventory',
    value: '₦174,950',
  },
  {
    color: '#F1A8D3',
    label: 'Low stock feeds',
    value: '1',
  },
]

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
