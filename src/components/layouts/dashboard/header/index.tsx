'use client'
import { Inline } from 'src/components/ui/inline'
import { Divider } from 'src/components/ui/divider'
import { ProfileMenu } from 'src/components/widgets/profile-menu'
import { NotificationMenu } from 'src/components/widgets/notification-menu'
import { HelpIcon } from 'src/components/global/help-icon'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../sidebar'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <header className="sticky left-0 top-0 z-50 flex h-[68px] w-full items-center justify-between bg-neutral-50 px-[20px] py-4 md:px-8 lg:px-3 ">
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

      {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {/* {isSidebarOpen && ( */}
      <div
        className={`z-60 fixed inset-0 left-[47px] top-[68px] space-y-10 overflow-scroll bg-neutral-50  px-[30px] pt-5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="">
          <ProfileMenu />
        </div>

        <div className="rounded-lg border border-neutral-300">
          <Sidebar />
        </div>
      </div>
      {/* )} */}
    </header>
  )
}
