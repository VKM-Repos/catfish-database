import { Inline } from 'src/components/ui/inline'
import { Divider } from 'src/components/ui/divider'
import { ProfileMenu } from 'src/components/widgets/profile-menu'
import { NotificationMenu } from 'src/components/widgets/notification-menu'
import { HelpIcon } from 'src/components/global/help-icon'

export function Header() {
  return (
    <header className="sticky left-0 top-0 z-50 flex h-[68px] w-full items-center justify-between bg-neutral-50 px-3 py-4 md:px-8">
      <Inline className="h-full w-full" gap="gap-4">
        <picture>
          <img src="/fish-logo.webp" alt="Logo" className="aspect-square w-[38px]" />
        </picture>
        <Divider orientation="vertical" />
        <ProfileMenu />
      </Inline>

      <div className="flex w-full place-content-end items-center gap-4">
        <NotificationMenu />
        <HelpIcon />
      </div>
    </header>
  )
}
