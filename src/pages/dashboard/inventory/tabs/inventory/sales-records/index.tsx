import { useMemo } from 'react'
import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Heading } from 'src/components/ui/heading'
import SalesStatistics from './sales-stats'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import { Section } from 'src/components/ui/section'
import PondRevenue from './pond-revenue'
import { fishBatchResponseSchema } from 'src/schemas'
import { Container } from 'src/components/ui/container'

type SalesRecordRaw = {
  id: string
  fishBatchId: string
  quantityInKg?: number
  costPerKg?: number
  totalAmount?: number
  [key: string]: any
}

type EnrichedSalesRecord = SalesRecordRaw & {
  pond?: any
}

const fishBatchesResponseSchema = z.object({
  content: z.array(fishBatchResponseSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
})

const useGetSalesRecords = createGetQueryHook({
  endpoint: `/harvests/by-farmer/me?direction=DESC`,
  responseSchema: z.any(),
  queryKey: ['sales-records'],
})

const useGetAllFishBatches = createGetQueryHook({
  endpoint: `/fish-batches`,
  responseSchema: fishBatchesResponseSchema,
  queryKey: ['fish-batches-all'],
})

const useGetVolumeOfSales = createGetQueryHook({
  endpoint: 'dashboards/farmer/volume-of-sales?interval=ALL',
  responseSchema: z.any(),
  queryKey: ['volume-sales'],
})

export default function SalesRecords() {
  const navigate = useNavigate()
  const { data: salesRecordsRaw, isLoading: isLoadingSales } = useGetSalesRecords()
  const { data: volumeOfSales } = useGetVolumeOfSales()
  const raw: SalesRecordRaw[] = salesRecordsRaw?.content ?? []

  const { data: fishBatchesData, isLoading: isLoadingFishBatches } = useGetAllFishBatches({
    query: {
      size: 1000,
      direction: 'DESC',
      page: 0,
    },
  })

  const fishBatchMap = useMemo(() => {
    if (!fishBatchesData?.content) return {}

    return fishBatchesData?.content.reduce((acc, batch) => {
      if (batch?.id) {
        acc[batch.id] = batch
      }
      return acc
    }, {} as Record<string, (typeof fishBatchesData.content)[number]>)
  }, [fishBatchesData])

  const enrichedRecords: EnrichedSalesRecord[] = useMemo(() => {
    return raw.map((record) => {
      const fishBatchData = fishBatchMap[record.fishBatchId]

      return {
        ...record,
        pond: fishBatchData?.pond ?? null,
      }
    })
  }, [raw, fishBatchMap])

  console.log('Enriched Sales Records:', volumeOfSales)

  const isLoading = isLoadingSales || isLoadingFishBatches

  const title = 'Sales records'
  const actions = (
    <Inline>
      <Button
        variant="primary"
        className="flex items-center gap-2"
        onClick={() => navigate(paths.dashboard.inventory.createSalesRecord())}
      >
        <SolarIconSet.AddCircle size={20} />
        <Text>Add sales record</Text>
      </Button>
    </Inline>
  )

  return (
    <Container>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <SalesStatistics data={Array.isArray(volumeOfSales) ? volumeOfSales[0] : 0} />
        <FlexBox direction="row" align="center" justify="between" className="w-full">
          <Heading level={6}>{title}</Heading>
          <div>{actions}</div>
        </FlexBox>
        <DataTable
          search={false}
          columns={columns}
          data={enrichedRecords}
          isLoading={isLoading}
          emptyStateMessage="No sales record found"
        />
      </FlexBox>
      <Section className="mt-6 flex items-start justify-between gap-10">
        <PondRevenue />
      </Section>
    </Container>
  )
}
