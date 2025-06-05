export type ModulePermissions = {
  access: boolean
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export type ColumnFactoryProps = {
  handleToggle: (module: string, type: keyof ModulePermissions, value: boolean) => void
}

export type PermissionRow = {
  module: string
} & ModulePermissions

export type SwitchCellProps = {
  type: keyof ModulePermissions
  onToggle: (module: string, type: keyof ModulePermissions, value: boolean) => void
}
