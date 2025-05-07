import { useNavigate, useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import ActivityLogTable from './activity-log'
import PondStatistics from './pond-statistics'
import AverageWeight from './average-weight'
import FeedConversionRatio from './feed-conversion-ratio'
import MonthlyFeedConsumption from './monthly-feed-consumption'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { pondResponseSchema } from 'src/schemas'
import { formatDate } from 'src/lib/date'
import { formatLatLng } from 'src/lib/utils'
import { Loader } from 'src/components/ui/loader'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes'

const useGetPond = createGetQueryHook<typeof pondResponseSchema, { id: string }>({
  endpoint: '/ponds/:id',
  responseSchema: pondResponseSchema,
  queryKey: ['pond-details-for-farmer'],
})

export default function PondDetailOverview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: pondInfo, isLoading } = useGetPond({ route: { id: id! } })

  const pond = [
    { label: 'Type', value: pondInfo?.pondType },
    { label: 'Size', value: pondInfo?.size },
    { label: 'Water Source', value: pondInfo?.waterSource },
    {
      label: 'GPS coordinates',
      value: pondInfo?.latitude && pondInfo?.longitude ? formatLatLng(pondInfo?.latitude, pondInfo?.longitude) : '',
    },
    { label: 'Location', value: pondInfo?.cluster.name },
    { label: 'Created on', value: pondInfo?.createdAt ? formatDate(pondInfo.createdAt) : '' },
  ]

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Profile</Text>
        <Button
          variant="outline"
          className="border-primary-400"
          onClick={() => {
            id && navigate(paths.dashboard.ponds.id(id))
          }}
        >
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Edit</Text>
          </FlexBox>
        </Button>
      </FlexBox>
      {isLoading ? (
        <Loader type="spinner" />
      ) : (
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
      )}
      <PondStatistics />
      <ActivityLogTable />
      <section className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:items-stretch">
        <AverageWeight />
        <FeedConversionRatio />
      </section>
      <section className="h-fit w-full">
        <MonthlyFeedConsumption />
      </section>
    </FlexBox>
  )
}
