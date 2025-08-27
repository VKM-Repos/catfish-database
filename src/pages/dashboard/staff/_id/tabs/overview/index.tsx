import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import { Grid } from 'src/components/ui/grid'
import { Checkbox } from 'src/components/ui/checkbox'
import { useLocation } from 'react-router-dom'

export default function OverviewTab() {
  const location = useLocation()
  const user = location.state?.user

  // const [editStaff, setEditStaff] = useState(false)

  // const openModal = () => {
  //   setEditStaff(true)
  // }
  // const { data: feedingReports } = useGetFeedingReports()

  const title = 'Staff profile'
  const actions = (
    <Inline>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        // onClick={openModal}
      >
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
        <Grid cols={3} gap="gap-x-8 gap-y-4" className="w-full">
          <div>
            <Heading level={6}>First name</Heading>
            <Text>{user.firstName}</Text>
          </div>
          <div>
            <Heading level={6}>Last name</Heading>
            <Text>{user.lastName}</Text>
          </div>
          <div>
            <Heading level={6}>Phone nunber</Heading>
            <Text>{user.phone}</Text>
          </div>
          <div className="w-full">
            <Heading level={6}>Email</Heading>
            <Text>{user.email}</Text>
          </div>
          <div>
            <Heading level={6}>State</Heading>
            <Text>{user.cluster.state.name}</Text>
          </div>
          <div>
            <Heading level={6}>Cluster</Heading>
            <Text>{user.cluster.name}</Text>
          </div>
        </Grid>

        <Heading level={6} className="mb-10 mt-10">
          Role/Permission
        </Heading>
        <Grid cols={2} gap="gap-x-8 gap-y-4" className="w-full">
          <Text className="flex-1">Daily Farm Report Entry</Text>
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
          <Checkbox />
        </Grid>
      </FlexBox>
    </>
  )
}
