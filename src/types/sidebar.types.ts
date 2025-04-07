import { ReactNode } from 'react'

export type Path = string | { root: string; id?: (id: string) => string }

export type SideBarLink = {
  label: string
  path?: Path
  icon?: ReactNode
  subLinks?: SideBarLink[]
}
