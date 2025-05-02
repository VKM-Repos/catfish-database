import { useParams } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import ActivityLogTable from './activity-log'
import PondStatistics from './pond-statistics'
import AverageWeight from './average-weight'
import FeedConversionRatio from './feed-conversion-ratio'
import MonthlyFeedConsumption from './monthly-feed-consumption'

const pondInfo = {
  pondName: 'Pond 1A',
  fishQuantity: '1,800',
  weight: '320g',
  lastSampled: '02/04/2025',
  pondStatus: true,
  size: '500 m²',
  type: 'Concrete',
  waterSource: 'Borehole',
  longitude: '10.5210° N',
  latitude: ' 7.4380° E',
  location: 'Kaduna North Farm Cluster',
  createdOn: 'February 10, 2025',
}

const pond = [
  { label: 'Type', value: pondInfo.pondName },
  { label: 'Size', value: pondInfo.size },
  { label: 'Water Source', value: pondInfo.waterSource },
  { label: 'GPS coordinates', value: pondInfo.latitude + pondInfo.longitude },
  { label: 'Location', value: pondInfo.location },
  { label: 'Created on', value: pondInfo.createdOn },
]

export default function PondDetailOverview() {
  const { id } = useParams<{ id: string }>()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Profile</Text>
        <Button variant="outline" className="border-primary-400">
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Edit</Text>
          </FlexBox>
        </Button>
      </FlexBox>
      <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3 text-sm">
        {pond.map((item) => (
          <FlexBox key={item.label} gap="gap-2" direction="col">
            <Text variant="body" color="text-neutral-500" weight="semibold">
              {item.label}
            </Text>
            <Text variant="body" color="text-neutral-500" weight="light">
              {item.value}
            </Text>
          </FlexBox>
        ))}
      </Grid>
      <PondStatistics />
      <ActivityLogTable />
      <section className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:items-stretch ">
        <AverageWeight />
        <FeedConversionRatio />
      </section>
      <section className="h-fit w-full">
        <MonthlyFeedConsumption />
      </section>
    </FlexBox>
  )
}
