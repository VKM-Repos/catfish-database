import { useEffect, useMemo, useState } from 'react'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { DataTable } from 'src/components/ui/data-table'
import { z } from 'zod'
import { authCache } from 'src/api'

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.string()),
  // modules: z.any(), // privilege module array
  // createDate: z.any(),
  // status: z.boolean(),
  // user: z.any(),
})

const useGetRoles = createGetQueryHook({
  endpoint: '/roles',
  responseSchema: z.array(roleSchema),
  queryKey: ['roles'],
})

const useGetAllPrivileges = () => {
  const [allPrivileges, setAllPrivileges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchAll() {
      let page = 0
      const size = 100
      let privileges: any[] = []
      let totalPages = 1
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const token = authCache.getToken()

      while (page < totalPages) {
        const res = await fetch(`${baseUrl}/roles/privileges?page=${page}&size=${size}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        privileges = privileges.concat(data.content)
        totalPages = data.totalPages
        page++
      }
      if (isMounted) {
        setAllPrivileges(privileges)
        setLoading(false)
      }
    }
    fetchAll()
    return () => {
      isMounted = false
    }
  }, [])

  return { privileges: allPrivileges, loading }
}

export function RolesTable() {
  const { data: roles, isLoading: loadingRoles } = useGetRoles()
  const { privileges, loading: loadingPrivileges } = useGetAllPrivileges()

  // const [roles, setRoles] = useState([
  //   {
  //     id: 1,
  //     name: 'Super Admin',
  //     permissions: [],
  //     users: 1,
  //   },
  //   {
  //     id: 2,
  //     name: 'Admin',
  //     permissions: [],
  //     users: 451,
  //   },
  //   {
  //     id: 3,
  //     name: 'Cluster Manager',
  //     permissions: [],
  //     users: 190,
  //   },
  //   {
  //     id: 4,
  //     name: 'Farmer',
  //     permissions: [],
  //     users: 134,
  //   },
  //   {
  //     id: 5,
  //     name: 'Staff',
  //     permissions: [],
  //     users: 15,
  //   },
  // ])

  // Map privileges to modules/actions for each role
  const permissionsByRole = useMemo(() => {
    if (!roles || !privileges) return []

    return roles.map((role) => {
      const moduleMap: Record<string, any> = {}

      role.privilegeIds.forEach((pid) => {
        const priv = privileges.find((p) => p.id === pid)
        if (priv) {
          const [module] = priv.name.split(':')

          if (!moduleMap[module]) {
            moduleMap[module] = {
              module,
              access: false,
              view: false,
              create: false,
              edit: false,
              delete: false,
              moduleName: module.charAt(0).toUpperCase() + module.slice(1),
            }
          }

          if (priv.name.endsWith(':c')) moduleMap[module].create = true
          if (priv.name.endsWith(':r')) moduleMap[module].view = true
          if (priv.name.endsWith(':u')) moduleMap[module].edit = true
          if (priv.name.endsWith(':d')) moduleMap[module].delete = true
        }
      })

      return {
        id: role.id,
        name: role.name,
        description: role.description,
        modules: Object.values(moduleMap), // privilege module array
        createDate: '2025-05-26T14:57:00.715124',
        status: true,
        user: 32,
      }
    })
  }, [roles, privileges])

  console.log('new: ', permissionsByRole)

  return (
    <DataTable
      columns={columns}
      data={permissionsByRole || []}
      isLoading={loadingRoles || loadingPrivileges}
      search={false}
    />
  )
}
