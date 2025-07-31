'use client'
import { Inline } from 'src/components/ui/inline'
import { Divider } from 'src/components/ui/divider'
import { ProfileMenu } from 'src/components/widgets/profile-menu'
import { NotificationMenu } from 'src/components/widgets/notification-menu'
import { HelpIcon } from 'src/components/global/help-icon'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../sidebar'
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from 'src/components/ui/popover'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <header className="sticky left-0 top-0  z-[80] flex h-[68px] w-full items-center justify-between bg-neutral-50 px-[20px] py-4 md:px-8 lg:px-3 ">
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

        <Popover open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center lg:hidden">
              {isSidebarOpen ? (
                <button onClick={() => setIsSidebarOpen(false)} className="text-primary-500 ">
                  <X size={24} />
                  <span className="sr-only">Close Menu</span>
                </button>
              ) : (
                <button className="" onClick={() => setIsSidebarOpen(true)}>
                  <Menu className="text-primary-500" size={24} />
                </button>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="z-[90] mt-[13px] h-screen w-[calc(100vw-50px)] overflow-hidden rounded-lg border border-neutral-300 bg-white p-4 shadow-lg lg:hidden">
            <div className="mb-10 mt-5 bg-transparent">
              <ProfileMenu />
            </div>

            <div className="rounded-lg border border-neutral-300">
              <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
            </div>
            <PopoverArrow className="fill-white" />
          </PopoverContent>
        </Popover>
      </header>
    </>
  )
}
