import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { paths } from 'src/routes/paths'

export default function SalesRecordsDetailsModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useLocation()

  // Get the sales record from state
  const record = state?.item

  if (!id || !record) return null

  // Calculate average weight per fish
  const avgWeight =
    record.fishSold && record.totalWeight ? (Number(record.totalWeight) / Number(record.fishSold)).toFixed(2) : '-'

  const salesRecordDetails = [
    { label: 'Date', value: record.updatedAt ? formatDate(record.updatedAt) : '-' },
    { label: 'Pond name', value: record.name || '-' },
    { label: 'Total weight (kg)', value: record.totalWeight ?? '-' },
    { label: 'No. of fish sold', value: record.fishSold ?? '-' },
    { label: 'Cost per kg (₦)', value: record.cost ? `₦${record.cost}` : '-' },
    { label: 'Total income (₦)', value: record.income ? `₦${record.income}` : '-' },
    { label: 'Avg weight per fish (kg)', value: avgWeight },
  ]

  return (
    <Dialog open={true} onOpenChange={() => navigate(`${paths.dashboard.inventory.root}?tab=sales-records`)}>
      <DialogContent className="min-h-[410px] min-w-[740px] overflow-hidden px-8 py-4">
        <FlexBox direction="col" gap="gap-6" className="w-full py-4">
          <FlexBox justify="center" align="center" className="w-full">
            <Text className="text-xl font-semibold text-neutral-700">Sales Record Details</Text>
          </FlexBox>

          <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
            {salesRecordDetails.map((item) => (
              <FlexBox key={item.label} gap="gap-2" direction="col">
                <Text variant="body" size="base" color="text-neutral-500" weight="semibold">
                  {item.label}
                </Text>
                <Text variant="body" size="base" color="text-neutral-500" weight="light">
                  {item.value}
                </Text>
              </FlexBox>
            ))}
          </Grid>
          <div className="mt-6 flex w-full justify-between space-x-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate(`${paths.dashboard.inventory.root}?tab=sales-records`)}
            >
              Cancel
            </Button>
          </div>
        </FlexBox>
      </DialogContent>
    </Dialog>
  )
}
