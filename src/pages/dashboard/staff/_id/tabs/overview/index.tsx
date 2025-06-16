import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import { useState } from 'react'
import { Grid } from 'src/components/ui/grid'
import { Checkbox } from 'src/components/ui/checkbox'

export default function OverviewTab() {
  const [farmReportOpen, setFarmReportOpen] = useState(false)
  // const useGetFeedingReports = createGetQueryHook({
  //   endpoint: '/feeding-water-qualities',
  //   responseSchema: z.any(),
  //   queryKey: ['feeding-water-quality'],
  // })

  const openModal = () => {
    setFarmReportOpen(true)
  }
  // const { data: feedingReports } = useGetFeedingReports()

  const title = 'Staff profile'
  const actions = (
    <Inline>
      <Button variant="outline" className="flex items-center gap-2" onClick={openModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Edit</Text>
      </Button>
    </Inline>
  )

  return (
    <>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          {actions && <div>{actions}</div>}
        </FlexBox>
        <Grid cols={3}>
          <div>
            <Heading level={6}>First name</Heading>
            <Text>dfgfdfg</Text>
          </div>
          <div>
            <Heading level={6}>Last name</Heading>
            <Text>dfgfdfg</Text>
          </div>
          <div>
            <Heading level={6}>Phone nunber</Heading>
            <Text>dfgfdfg</Text>
          </div>
          <div>
            <Heading level={6}>Email</Heading>
            <Text>dfgfdfg</Text>
          </div>
          <div>
            <Heading level={6}>First Name</Heading>
            <Text>dfgfdfg</Text>
          </div>
          <div>
            <Heading level={6}>First Name</Heading>
            <Text>dfgfdfg</Text>
          </div>
        </Grid>

        <Heading level={6}>Role/Permission</Heading>
        <Grid cols={2} gap="gap-4">
          <Text>Daily Farm Report Entry</Text>
          <Checkbox />
          <Text>Sampling Report</Text>
          <Checkbox />
          <Text>Harvest Report</Text>
          <Checkbox />
          <Text>Feed Inventory</Text>
          <Checkbox />
          <Text>Maintenance Inventory</Text>
          <Checkbox />
          <Text>Sales Report</Text>
          <Checkbox />
          <Text>View Reports</Text>
          <Checkbox />
          <Text>Read-Only Access</Text>
        </Grid>
      </FlexBox>
    </>
  )
}
