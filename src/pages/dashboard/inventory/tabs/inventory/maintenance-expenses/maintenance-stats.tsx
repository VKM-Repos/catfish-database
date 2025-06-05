import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Grid } from 'src/components/ui/grid'

export default function MaintenanceStatistics() {
  return (
    <FlexBox direction="col" gap="gap-5" className="w-full py-4">
      <Grid cols={2} gap="gap-5" className="w-full text-sm md:grid-cols-4">
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
    color: '#B9D9FF',
    label: 'Total Maintenance Cost',
    value: '₦174,950',
  },
]

export function isPositive(value: string): boolean {
  const numericValue = parseFloat(value.replace('%', '').trim())
  return numericValue >= 0
}
