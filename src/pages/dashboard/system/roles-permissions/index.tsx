import { Outlet, useNavigate } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import * as SolarIconSet from 'solar-icon-set'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { RolesTable } from './components/role-table'
import { paths } from 'src/routes'
import { useEffect, useMemo, useState } from 'react'
import { authCache } from 'src/api'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'

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

export default function RolesPermissionsPage() {
  const title = 'Roles & Permissions'
  const navigate = useNavigate()

  const { data: roles, isLoading: loadingRoles } = useGetRoles()
  const { privileges, loading: loadingPrivileges } = useGetAllPrivileges()

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
        ...role,
        modules: Object.values(moduleMap), // privilege module array
      }
    })
  }, [roles, privileges])

  const openCreateModal = () => {
    navigate(paths.dashboard.system.rolesPermission.create, {
      state: { allPrivileges: privileges },
    })
  }
  const actions = (
    <Inline>
      <Button variant="primary" className="flex items-center gap-2" onClick={openCreateModal}>
        <SolarIconSet.AddCircle size={20} />
        <Text>Add new role</Text>
      </Button>
    </Inline>
  )

  return (
    <div className="relative mb-20">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} subtitle="Manage user roles and their permissions." />
          <Spacer />
          {/* <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" /> */}
          <RolesTable permissionsByRole={permissionsByRole || []} isLoading={loadingRoles || loadingPrivileges} />
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
