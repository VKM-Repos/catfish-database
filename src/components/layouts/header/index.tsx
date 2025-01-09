import { Inline } from '../inline'
import { Divider } from '../divider'
import { ProfileDropdown } from 'src/components/profile-dropdown'
import { SearchGlobal } from 'src/components/search-global'

export function Header() {
  return (
    <header className="sticky left-0 top-0 flex h-[68px] w-full items-center justify-between bg-neutral-50 px-4 py-4 md:px-12">
      <Inline className="h-full w-full" gap="gap-4">
        <picture>
          <img src="../../../../fish-fao.png" alt="Logo" className="aspect-square w-[38px]" />
        </picture>
        <Divider orientation="vertical" />
        <ProfileDropdown />
      </Inline>

      <div className="flex w-full place-content-end items-center gap-4">
        <SearchGlobal />
      </div>
    </header>
  )
}
