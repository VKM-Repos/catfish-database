import { ReactNode, createContext, useContext } from 'react'
import { sideBarLinks } from 'src/components/layouts/dashboard/sidebar/sidebar-links'
import { useAuthStore } from 'src/store/auth.store'
import { SideBarLink } from 'src/types/sidebar.types'

type SideBarContextValue = {
  links: SideBarLink[]
}

const SideBarContext = createContext<SideBarContextValue | undefined>(undefined)

type SideBarProviderProps = {
  children: ReactNode
}

export default function SideBarProvider({ children }: SideBarProviderProps) {
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role || 'farmer'
  const activeLinks = sideBarLinks[userRole] || []

  return <SideBarContext.Provider value={{ links: activeLinks }}>{children}</SideBarContext.Provider>
}

export function useSideBar() {
  const context = useContext(SideBarContext)
  if (!context) {
    throw new Error('useSideBar must be used within SideBarProvider')
  }
  return context
}
