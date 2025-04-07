import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'

export const Search = () => {
  return (
    <div className="relative w-full max-w-md">
      <Input type="text" placeholder="Search" className="w-full bg-white pl-10" />
      <SolarIconSet.MinimalisticMagnifer
        size={22}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
      />
    </div>
  )
}
