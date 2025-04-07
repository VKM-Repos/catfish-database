import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'

export function Menubar() {
  return (
    <nav className="sticky left-0 top-[68px] z-50 flex h-fit w-full items-center justify-between bg-white px-10 py-4">
      <div className="flex w-full place-content-start items-center ">
        <Button
          size="lg"
          variant="outline"
          className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
        >
          <SolarIconSet.Home color="currentColor" size={20} iconStyle="Outline" />
          <Text size="sm" weight="light">
            All Clusters
          </Text>
          <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Bold" />
        </Button>
      </div>
      <div className="flex w-full place-content-end items-center gap-4">
        <Text size="sm" weight="light">
          All Time
        </Text>
        <Button
          variant="outline"
          className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
        >
          <Text size="sm" weight="light">
            May 21 - 27, 2024
          </Text>
          <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
        </Button>
      </div>
    </nav>
  )
}
