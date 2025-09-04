import { useNavigate, useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import PondStatistics from './pond-statistics'
import AverageWeight from './average-weight'
import FeedConversionRatio from './feed-conversion-ratio'
import MonthlyFeedConsumption from './monthly-feed-consumption'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { pondResponseSchema } from 'src/schemas'
import { formatDate } from 'src/lib/date'
import { formatLatLng, formatNumberWithCommas } from 'src/lib/utils'
import { Loader } from 'src/components/ui/loader'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'

import { useState } from 'react'
import MegaDatePicker, { DateRange } from 'src/components/ui/mega-datepicker'
import UpdatePondPage from '../../edit'

const useGetPond = createGetQueryHook<typeof pondResponseSchema, { id: string }>({
  endpoint: '/ponds/:id',
  responseSchema: pondResponseSchema,
  queryKey: ['pond-details-for-farmer'],
})

export default function PondDetailOverview() {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1), // Default to "All Time"
    to: new Date(),
  })

  const { data: pondInfo, isLoading } = useGetPond({ route: { id: id! } })

  const pond = [
    { label: 'Type', value: pondInfo?.pondType },
    { label: 'Size', value: formatNumberWithCommas(Number(pondInfo?.size)) },
    { label: 'Water Source', value: pondInfo?.waterSource },
    {
      label: 'GPS coordinates',
      value:
        pondInfo?.latitude && pondInfo?.longitude
          ? formatLatLng(String(pondInfo?.latitude), String(pondInfo?.longitude))
          : '',
    },
    { label: 'Location', value: pondInfo?.cluster.name },
    { label: 'Created on', value: pondInfo?.createdAt ? formatDate(pondInfo?.createdAt) : '' },
  ]

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
    // You can add additional logic here to refetch data with the new date range
    // For example, update query parameters or trigger data refresh
  }

  const openModal = () => {
    setEditModalOpen(true)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <FlexBox direction="col" gap="gap-12" className="w-full">
      <FlexBox direction="row" align="center" justify="between" className="w-full">
        <Heading level={6}>Pond Info</Heading>
        <Button variant="outline" size={'sm'} className="border-primary-400" onClick={openModal}>
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Edit</Text>
          </FlexBox>
        </Button>
      </FlexBox>

      <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3 text-sm">
        {pond?.map((item) => (
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

      {/* Filter Section with Mega Date Picker */}
      <FlexBox
        direction="row"
        // align="center"
        justify="between"
        className="w-full flex-col items-start gap-4 lg:flex-row lg:items-center"
      >
        <Heading level={6}>Pond Statistics</Heading>
        <MegaDatePicker value={dateRange} onChange={handleDateRangeChange} className="w-auto" />
      </FlexBox>

      {/* Pass date range to child components for filtering */}
      {id && <PondStatistics pondId={id} />}

      <section className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:items-stretch">
        <AverageWeight dateRange={dateRange} />
        <FeedConversionRatio dateRange={dateRange} />
      </section>

      <section className="h-fit w-full">
        <MonthlyFeedConsumption dateRange={dateRange} />
      </section>
      <UpdatePondPage open={editModalOpen} onOpenChange={setEditModalOpen} id={id} />
    </FlexBox>
  )
}
