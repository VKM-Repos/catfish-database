import { useNavigate, useParams } from 'react-router-dom'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { PondsTable } from './table'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { paths } from 'src/routes'

export default function Ponds() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Ponds</Text>
        <Button
          variant="outline"
          className="border-primary-400"
          onClick={() => {
            navigate(paths.dashboard.ponds.create.addPond)
          }}
        >
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.AddCircle color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Add pond</Text>
          </FlexBox>
        </Button>
      </FlexBox>
      <PondsTable />
    </FlexBox>
  )
}
