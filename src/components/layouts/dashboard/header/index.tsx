'use client'
import { Inline } from 'src/components/ui/inline'
import { Divider } from 'src/components/ui/divider'
import { ProfileMenu } from 'src/components/widgets/profile-menu'
import { NotificationMenu } from 'src/components/widgets/notification-menu'
import { HelpIcon } from 'src/components/global/help-icon'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../sidebar'
import { Dialog, DialogTrigger, DialogOverlay, DialogPortal, SideDialogContent } from 'src/components/ui/dialog'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <header className="sticky left-0 top-0 z-[80] flex h-[68px] w-full items-center justify-between bg-neutral-50 px-[20px] py-4 md:px-8 lg:px-3">
        <Inline className="h-full w-full" gap="gap-4">
          <picture>
            <img src="/fish-logo.webp" alt="Logo" className="aspect-square w-[38px]" />
          </picture>
          <Divider orientation="vertical" className="invisible lg:visible" />
          <div className="hidden lg:inline">
            <ProfileMenu />
          </div>
        </Inline>

        <div className="hidden w-full place-content-end items-center gap-4 lg:flex">
          <NotificationMenu />
          <HelpIcon />
        </div>

        {/* Mobile Menu */}
        <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center lg:hidden">
              {isSidebarOpen ? (
                <button className="text-primary-500">
                  <X size={24} />
                  <span className="sr-only">Close Menu</span>
                </button>
              ) : (
                <button className="text-primary-500">
                  <Menu size={24} />
                </button>
              )}
            </div>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            <SideDialogContent className="right-0 top-[68px] z-[90] flex h-screen w-[calc(100vw-50px)] flex-col justify-start gap-10 overflow-y-auto bg-white p-4 shadow-lg focus:outline-none lg:hidden">
              <div className="mt-5">
                <ProfileMenu onLinkClick={() => setIsSidebarOpen(false)} />
              </div>
              <div className="rounded-lg">
                <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
              </div>
            </SideDialogContent>
          </DialogPortal>
        </Dialog>
      </header>
    </>
  )
}
