import { FlexBox } from 'src/components/ui/flexbox'
import { useState } from 'react'

export default function ActiviyLogTab() {
  // const useGetSamplingReports = createGetQueryHook({
  //   endpoint: '/samplings/me',
  //   responseSchema: z.any(),
  //   queryKey: ['harvest-reports-table'],
  // })
  // const { data: samplingReports } = useGetSamplingReports()
  const [farmReportOpen, setFarmReportOpen] = useState(false)

  function extractHarvestObjectsWithCreatedAt(apiResponse: any) {
    if (!Array.isArray(apiResponse)) {
      return []
    }

    return apiResponse
      .filter((item) => item.harvest && typeof item.harvest === 'object')
      .map((item) => ({
        ...item.harvest,
        createdAt: item.createdAt,
      }))
  }
  const openModal = () => {
    setFarmReportOpen(true)
  }

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      {/* <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Heading level={6}>{title}</Heading>
        {actions && <div>{actions}</div>}
      </FlexBox> */}
      <div>todo</div>
    </FlexBox>
  )
}
