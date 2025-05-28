import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { FlexBox } from 'src/components/ui/flexbox'
import { Grid } from 'src/components/ui/grid'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { formatDate } from 'src/lib/date'
import { fishBatchResponseType } from 'src/types/ponds.types'

type DetailsPageProps = {
  batch: fishBatchResponseType
  open: boolean
  setOpenEdit: (openEdit: boolean) => void
  onOpenChange: (open: boolean) => void
}

export default function ViewBatchDetails({ open, setOpenEdit, batch, onOpenChange }: DetailsPageProps) {
  const batchDetails = [
    { label: 'Date', value: batch?.createdAt && formatDate(batch?.createdAt) },
    { label: 'Source', value: 'Supplier' },
    { label: 'Batch', value: 'Batch L5' },
    { label: 'Description', value: '1mm' },
    { label: 'Average weight', value: '8g' },
    { label: 'Fish size', value: 'Fingerlings' },
  ]
  const openEditForm = () => {
    onOpenChange(false)
    setOpenEdit(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-h-[40rem] min-w-fit overflow-hidden px-8 py-4`}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <>
          <VisuallyHidden>
            <DialogTitle>View Fish Batch Details</DialogTitle>
            <DialogDescription>This prompt allows you view and edit fish batch details</DialogDescription>
          </VisuallyHidden>
          <div className="w-full min-w-[46.25rem] pb-[2rem] pt-[4rem]">
            <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
              <Heading className="text-center font-bold" level={6}>
                View batch details
              </Heading>
            </div>
            <FlexBox gap="gap-6" direction="col" className="w-full">
              <Grid cols={3} gap="gap-6" className="w-full !grid-cols-3">
                {batchDetails.map((item) => (
                  <FlexBox key={item.label} gap="gap-2" direction="col">
                    <Text color="text-neutral-500" weight="semibold">
                      {item.label}
                    </Text>
                    <Text variant="body" color="text-neutral-500" weight="light">
                      {item.value}
                    </Text>
                  </FlexBox>
                ))}
              </Grid>
              <FlexBox gap="gap-6" className="w-full">
                <FlexBox gap="gap-2" direction="col" className="w-full">
                  <Text color="text-neutral-500" weight="semibold">
                    Quantity
                  </Text>
                  <Text variant="body" color="text-neutral-500" weight="light">
                    {batch?.quantity}
                  </Text>
                </FlexBox>
                <FlexBox gap="gap-2" direction="col" className="w-full">
                  <Text color="text-neutral-500" weight="semibold">
                    Cost of supply
                  </Text>
                  <Text variant="body" color="text-neutral-500" weight="light">
                    {batch?.costOfSupply}
                  </Text>
                </FlexBox>
              </FlexBox>
              <FlexBox className="w-full">
                <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                  Back
                </Button>
                <Button type="button" variant="primary" className="w-full" onClick={openEditForm}>
                  Edit
                </Button>
              </FlexBox>
            </FlexBox>
          </div>
        </>
      </DialogContent>
    </Dialog>
  )
}
