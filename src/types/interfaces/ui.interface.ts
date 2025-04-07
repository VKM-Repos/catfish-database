export type InputState = 'default' | 'error' | 'success' | 'disabled'
export type InputTone = 'filled' | 'outline'
export type IconPosition = 'left' | 'right' | 'both'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  state?: InputState
  tone?: InputTone
  icon?: React.ReactNode
  iconPosition?: IconPosition
  errorMessage?: string
  successMessage?: string
  className?: string
}

export type TextVariant = 'body' | 'subtitle' | 'label' | 'caption'

export interface TextProps {
  variant?: TextVariant
  children: React.ReactNode
  className?: string
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps {
  level: HeadingLevel
  children: React.ReactNode
  className?: string
}

export interface PageProps {
  children: React.ReactNode
  className?: string
}

export interface SideBarLink {
  title: string
  href: string
  icon: React.ReactNode
  children?: SideBarLink[]
}

export interface SideBarContextValue {
  links: SideBarLink[]
  isOpen: boolean
  toggle: () => void
}

export interface SideBarProviderProps {
  children: React.ReactNode
}

export interface ProvidersProps {
  children: React.ReactNode
}

export interface LazyPageProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>
}

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
}

export interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}
