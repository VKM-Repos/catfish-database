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
  averageSellingPrice: number
  totalSales: number
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

export default function SalesRecords() {
  const navigate = useNavigate()
  const { data: salesRecordsRaw, isLoading: isLoadingSales } = useGetSalesRecords()
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

    return fishBatchesData.content.reduce((acc, batch) => {
      if (batch?.id) {
        acc[batch.id] = batch
      }
      return acc
    }, {} as Record<string, (typeof fishBatchesData.content)[number]>)
  }, [fishBatchesData])

  const enrichedRecords: EnrichedSalesRecord[] = useMemo(() => {
    return raw.map((record) => {
      const fishBatchData = fishBatchMap[record.fishBatchId]

      const quantityInKg = Number(record?.quantityInKg ?? 0)
      const costPerKg = Number(record?.costPerKg ?? 0)
      const totalAmount = Number(record?.totalAmount ?? 0)

      const averageSellingPrice =
        quantityInKg > 0 && totalAmount > 0 ? Number((totalAmount / quantityInKg).toFixed(2)) : 0

      const totalSales = quantityInKg > 0 && costPerKg > 0 ? quantityInKg * costPerKg : totalAmount

      return {
        ...record,
        pond: fishBatchData?.pond ?? null,
        averageSellingPrice,
        totalSales,
      }
    })
  }, [raw, fishBatchMap])

  // ⬇️ Calculate total and average across all records
  const salesStats = useMemo(() => {
    const totalQuantity = enrichedRecords.reduce((sum, r) => sum + (r.quantityInKg ?? 0), 0)
    const totalRevenue = enrichedRecords.reduce((sum, r) => sum + (r.totalSales ?? 0), 0)
    const averageSellingPrice = totalQuantity > 0 ? Number((totalRevenue / totalQuantity).toFixed(2)) : 0

    return {
      totalRevenue,
      averageSellingPrice,
      totalQuantity,
    }
  }, [enrichedRecords])

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
    <>
      <FlexBox direction="col" gap="gap-4" className="w-full">
        <SalesStatistics data={salesStats} />
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
    </>
  )
}
