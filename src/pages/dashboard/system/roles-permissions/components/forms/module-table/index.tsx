import { DataTable } from 'src/components/ui/data-table'
import { createColumns } from './columns'
import { useMemo, useState } from 'react'
import { Privilege } from 'src/types/privilage'

type ModuleTableProps = {
  mode: 'create' | 'edit'
  allPrivileges: any[]
  role?: any
  onChangePrivilegeIds: (ids: string[]) => void
}

export default function ModuleTable({ mode, allPrivileges, role, onChangePrivilegeIds }: ModuleTableProps) {
  // Local state for privilegeIds
  const [privilegeIds, setPrivilegeIds] = useState<string[]>(mode === 'create' ? [] : role.privilegeIds)

  const permissionTypes = ['access', 'view', 'create', 'edit', 'delete']

  const moduleTypes = [
    { module: 'batch', moduleName: 'Batch' },
    { module: 'pond', moduleName: 'Pond' },
    { module: 'sampling', moduleName: 'Sampling' },
    { module: 'maintenance', moduleName: 'Maintenance' },
    { module: 'user', moduleName: 'User' },
    { module: 'harvest', moduleName: 'Harvest' },
    { module: 'daily_report', moduleName: 'Daily_report' },
    { module: 'report', moduleName: 'Report' },
  ]

  const permissions = moduleTypes.map(({ module, moduleName }) => {
    if (mode === 'edit') {
      const existing = role?.modules?.find((m: any) => m.module === module)
      if (existing) {
        return {
          module,
          moduleName,
          ...permissionTypes.reduce((acc, type) => {
            acc[type] = !!existing[type] // preserve existing permissions
            return acc
          }, {} as Record<string, boolean>),
        }
      }
    }

    // Default permissions (all false)
    return {
      module,
      moduleName,
      ...permissionTypes.reduce((acc, type) => {
        acc[type] = false
        return acc
      }, {} as Record<string, boolean>),
    }
  })

  // Map module+action to privilegeId for quick lookup
  const privilegeMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    allPrivileges.forEach((priv: Privilege) => {
      const [module, action] = priv.name.split(':')
      // console.log('map', module, action)
      if (!map[module]) map[module] = {}
      map[module][action] = priv.id
    })

    return map
  }, [allPrivileges])

  // Toggle logic
  const handleToggle = (module: string, type: string, value: boolean) => {
    // Map type to privilege action
    const actionMap: Record<string, string> = {
      create: 'c',
      view: 'r',
      edit: 'u',
      delete: 'd',
    }
    const action = actionMap[type]
    if (!action) return

    const privilegeId = privilegeMap[module]?.[action]
    if (!privilegeId) return

    setPrivilegeIds((prev) => {
      const hasPrivilege = prev.includes(privilegeId)
      let updated: string[]
      if (value && !hasPrivilege) {
        updated = [...prev, privilegeId]
      } else if (!value && hasPrivilege) {
        updated = prev.filter((id) => id !== privilegeId)
      } else {
        updated = prev
      }

      // Sync with form
      onChangePrivilegeIds(updated)

      return updated
    })
  }

  // Prepare table data with toggled state
  const tableData = useMemo(() => {
    return permissions.map((perm: any) => {
      const module = perm.module
      // console.log('perm: ', privilegeMap)
      return {
        ...perm,
        create: privilegeIds.includes(privilegeMap[module]?.c),
        view: privilegeIds.includes(privilegeMap[module]?.r),
        edit: privilegeIds.includes(privilegeMap[module]?.u),
        delete: privilegeIds.includes(privilegeMap[module]?.d),
      }
    })
  }, [permissions, privilegeIds, privilegeMap])

  const columns = createColumns({ handleToggle })

  return <DataTable columns={columns} data={tableData || []} search={false} hidePagination={true} />
}
