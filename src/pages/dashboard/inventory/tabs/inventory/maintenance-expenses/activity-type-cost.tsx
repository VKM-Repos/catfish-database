import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Grid } from 'src/components/ui/grid'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

const mockActivityCosts = [
  { type: 'Cleaning', price: '₦2,000' },
  { type: 'Repairs', price: '₦5,500' },
  { type: 'Disinfection', price: '₦3,200' },
  { type: 'Others', price: '₦1,000' },
]

export default function ActivityTypeCost() {
  return (
    <Card className="min-h-[25rem] w-full rounded-[.875rem] border border-neutral-200 p-8">
      <ChartHeader title={'Activity Type Costs'} action={null} />
      <Grid cols={1} gap="gap-6" className="mt-6 w-full !grid-cols-1 text-sm">
        {mockActivityCosts.map((item) => (
          <FlexBox key={item.type} gap="gap-2" direction="row" justify="between">
            <Text variant="body" color="text-neutral-500" weight="normal">
              {item.type}
            </Text>
            <Text variant="body" color="text-neutral-500" weight="semibold">
              {item.price}
            </Text>
          </FlexBox>
        ))}
      </Grid>
    </Card>
  )
}
