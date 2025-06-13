import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import * as SolarIconSet from 'solar-icon-set'

type FeedInventoryActionsProps = {
  item: any
}

export function FeedInventoryActions({ item }: FeedInventoryActionsProps) {
  const navigate = useNavigate()

  return (
    <FlexBox gap="gap-4">
      <Button
        size="sm"
        variant="outline"
        className="border-primary-400"
        onClick={() => navigate(paths.dashboard.inventory.viewFeedActivityLog(item.id), { state: { item } })}
      >
        <FlexBox gap="gap-2" align="center">
          <SolarIconSet.Eye color="#651391" size={20} iconStyle="Outline" />
          <Text className="text-primary-400">History</Text>
        </FlexBox>
      </Button>
      <Button
        size="sm"
        variant="primary"
        onClick={() => navigate(paths.dashboard.inventory.createFeedStock('inventory'), { state: { item } })}
      >
        <FlexBox gap="gap-2" align="center">
          <SolarIconSet.AddCircle color="#fff" size={20} iconStyle="Outline" />
          <Text className="text-white">Add</Text>
        </FlexBox>
      </Button>
    </FlexBox>
  )
}
