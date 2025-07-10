import { useNavigate, useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import FarmStatistics from './farm-statistics'
import AverageWeight from './average-weight'
import FeedConversionRatio from './feed-conversion-ratio'
import MonthlyFeedConsumption from './monthly-feed-consumption'
import { formatDate } from 'src/lib/date'
import { Loader } from 'src/components/ui/loader'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes'
import { User } from 'src/types'
import { useState } from 'react'
import { DateRange } from 'src/components/ui/mega-datepicker'

type FarmerProps = {
  farmer: User
  isLoading: boolean
}

export default function FarmDetailOverview({ farmer, isLoading }: FarmerProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2020, 0, 1), // Default to "All Time"
    to: new Date(),
  })

  const farmer_details = [
    { label: 'First Name', value: farmer.firstName },
    { label: 'Last Name', value: farmer.lastName },
    { label: 'Email', value: farmer.email },
    { label: 'Phone Number', value: farmer.phone },
    { label: 'Cluster', value: farmer.cluster.name },
    { label: 'Registered on', value: farmer?.createdAt ? formatDate(farmer.createdAt) : '' },
  ]

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Farmer&apos;s info</Text>
        <Button
          variant="outline"
          className="border-primary-400"
          onClick={() => {
            id && navigate(paths.dashboard.farmers.id(id))
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
          {farmer_details.map((item) => (
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
      {id && <FarmStatistics farmerId={id} />}
      <section className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:items-stretch">
        <AverageWeight dateRange={dateRange} />
        <FeedConversionRatio dateRange={dateRange} />
      </section>
      <section className="h-fit w-full">
        <MonthlyFeedConsumption dateRange={dateRange} />
      </section>
    </FlexBox>
  )
}
