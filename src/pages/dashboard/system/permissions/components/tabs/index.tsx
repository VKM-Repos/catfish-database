import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DataTable } from 'src/components/ui/data-table'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { createColumns } from '../permissions-table/columns'
import { createPutMutationHook } from 'src/api/hooks/usePut'
import { z } from 'zod'
import PermissionsSavedModal from '../modals/permissions-saved'

type Permissions = {
  module: string
  access: boolean
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  moduleName?: string
  // Add privilegeIds for each action
  privilegeIds?: {
    create?: string
    view?: string
    edit?: string
    delete?: string
  }
}

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.string()),
})

export default function PermissionsTabContent({
  permissions,
  role,
  allPrivileges,
  isLoading,
}: {
  permissions: Permissions[]
  role: { id: string; name: string; description: string; privilegeIds: string[] }
  allPrivileges: any[]
  isLoading?: boolean
}) {
  // Local state for privilegeIds
  const [privilegeIds, setPrivilegeIds] = useState<string[]>(role.privilegeIds)
  const [dirty, setDirty] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const queryClient = useQueryClient()

  // console.log('Permissions permissions: ', permissions)

  // Map module+action to privilegeId for quick lookup
  const privilegeMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    allPrivileges.forEach((priv) => {
      const [module, action] = priv.name.split(':')
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
      setDirty(true)
      return updated
    })
  }

  // Prepare table data with toggled state
  const tableData = useMemo(() => {
    return permissions.map((perm) => {
      const module = perm.module
      return {
        ...perm,
        create: privilegeIds.includes(privilegeMap[module]?.c),
        view: privilegeIds.includes(privilegeMap[module]?.r),
        edit: privilegeIds.includes(privilegeMap[module]?.u),
        delete: privilegeIds.includes(privilegeMap[module]?.d),
      }
    })
  }, [permissions, privilegeIds, privilegeMap])

  // PUT mutation
  const usePutRole = createPutMutationHook({
    endpoint: `/roles/${role.id}`,
    requestSchema: roleSchema,
    responseSchema: roleSchema,
  })
  const mutation = usePutRole()

  const handleSave = () => {
    mutation.mutate(
      {
        id: role.id,
        name: role.name,
        description: role.description,
        privilegeIds,
      },
      {
        onSuccess: () => {
          setShowSaved(true)
          queryClient.invalidateQueries(['roles'])
        },
      },
    )
    setDirty(false)
  }

  const columns = createColumns({ handleToggle })

  return (
    <FlexBox gap="gap-6" direction="col">
      <DataTable columns={columns} data={tableData} search={false} isLoading={isLoading} />
      <FlexBox justify="between" className="w-full">
        <Text size="sm" className="rounded-lg border border-neutral-200 px-[6px] py-[3px]">
          Last updated by Jane Smith on May 6, 2025
        </Text>
        <Button variant="primary" disabled={!dirty} onClick={handleSave}>
          Save Changes
        </Button>
      </FlexBox>
      <PermissionsSavedModal open={showSaved} onClose={() => setShowSaved(false)} />
    </FlexBox>
  )
}
