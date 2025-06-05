import { Card } from 'src/components/ui/card'
import { ChartHeader } from 'src/components/global/chart-header'
import { Grid } from 'src/components/ui/grid'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'

// Generate a random number of ponds between 3 and 6
const pondCount = Math.floor(Math.random() * 4) + 3 // 3 to 6

// Generate mock pond costs
const pondCosts = Array.from({ length: pondCount }).map((_, idx) => ({
  name: `Pond ${String.fromCharCode(65 + idx)}`, // Pond A, Pond B, ...
  price: `₦${(Math.floor(Math.random() * 10000) + 2000).toLocaleString()}`,
}))

export default function PondCost() {
  return (
    <Card className="min-h-[25rem] w-full rounded-[.875rem] border border-neutral-200 p-8">
      <ChartHeader title={'Cost by pond'} action={null} />
      <Grid cols={1} gap="gap-6" className="mt-6 w-full !grid-cols-1 text-sm">
        {pondCosts.map((item) => (
          <FlexBox key={item.name} gap="gap-2" direction="row" justify="between">
            <Text variant="body" color="text-neutral-500" weight="semibold">
              {item.name}
            </Text>
            <Text variant="body" color="text-neutral-500" weight="light">
              {item.price}
            </Text>
          </FlexBox>
        ))}
      </Grid>
    </Card>
  )
}
