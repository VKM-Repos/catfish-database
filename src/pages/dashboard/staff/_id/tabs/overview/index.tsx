import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import { useState } from 'react'

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
      <Button variant="primary" className="flex items-center gap-2" onClick={openModal}>
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
        <div>to doo</div>
      </FlexBox>
    </>
  )
}
