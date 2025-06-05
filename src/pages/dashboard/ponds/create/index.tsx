import { FlagIcon } from 'src/assets/icons/svg-icons'
import { FlexBox } from 'src/components/ui/flexbox'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { Outlet, useLocation } from 'react-router-dom'

export default function CreatePondPage() {
  const location = useLocation()
  const pathname = location.pathname

  const isAddPond = pathname.includes('add-pond')
  const isAddFish = pathname.includes('add-fish-to-pond')

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto w-full max-w-[50%]">
      {isAddPond && (
        <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
          <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
            Add a Pond{' '}
            <span>
              <FlagIcon />
            </span>
          </h1>
          <Text>Add your pond with these guided steps</Text>
        </FlexBox>
      )}
      {isAddFish && (
        <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
          <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
            Add Fish to a Pond
            <span>
              <SolarIconSet.Waterdrop />
            </span>
          </h1>
          <Text>Let’s add the fish you just stocked into this pond</Text>
        </FlexBox>
      )}
      <Outlet />
    </FlexBox>
  )
}
