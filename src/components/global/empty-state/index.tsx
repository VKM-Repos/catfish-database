import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

type CurrentState = {
  name: string
  image: string
  text: string
  buttonFunc: () => void
}

export default function EmptyTableState({ name, image, text, buttonFunc }: CurrentState) {
  return (
    <FlexBox direction="col" gap="gap-5" align="center" className=" py-12">
      <img src={image} alt="Empty state image" className="mb-4 h-auto max-h-[15rem] w-auto" />
      <FlexBox direction="col" gap="gap-3" align="center">
        <Text className="text-lg font-semibold text-neutral-700">Start by creating {text}</Text>
        <Button variant="primary" className="flex items-center gap-2" onClick={buttonFunc}>
          <SolarIconSet.AddCircle size={20} />
          <Text>Add {name}</Text>
        </Button>
      </FlexBox>
    </FlexBox>
  )
}
