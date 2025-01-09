import { ReactNode, createContext, useContext } from 'react'
import { sideBarLinks } from 'src/lib/sidebar-links'

type SideBarLink = {
  label: string
  path?: string
  icon?: ReactNode
  subLinks?: SideBarLink[]
}

type SideBarContextValue = {
  links: SideBarLink[]
}

type Role = 'super_admin' | 'cluster_manager'

const SideBarContext = createContext<SideBarContextValue | undefined>(undefined)

type SideBarProviderProps = {
  children: ReactNode
}

export default function SideBarProvider({ children }: SideBarProviderProps) {
  const activeRole: Role = 'super_admin'
  const activeLinks = sideBarLinks[activeRole] || []

  return <SideBarContext.Provider value={{ links: activeLinks }}>{children}</SideBarContext.Provider>
}

export function useSideBar() {
  const context = useContext(SideBarContext)
  if (!context) {
    throw new Error('useSideBar must be used within SideBarProvider')
  }
  return context
}
