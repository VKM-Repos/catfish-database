import { useMemo, useState, useEffect } from 'react'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { Spacer } from 'src/components/ui/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import PermissionsTabContent from './components/tabs'
import { authCache } from 'src/api'
import { FlexBox } from 'src/components/ui/flexbox'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { PageHeader } from 'src/components/ui/page-header'

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.string()),
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

export default function PermissionsPage() {
  const title = 'Roles & Permissions'
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)

  const { data: roles, isLoading: loadingRoles } = useGetRoles()
  const { privileges, loading: loadingPrivileges } = useGetAllPrivileges()

  // Set the first role as the default tab
  const roleTabs = roles || []
  const defaultTab = roleTabs[0]?.name

  // Set active tab on first load or when roles change
  useMemo(() => {
    if (!activeTab && defaultTab) setActiveTab(defaultTab)
  }, [defaultTab, activeTab])

  // Map privileges to modules/actions for each role
  const permissionsByRole = useMemo(() => {
    if (!roles || !privileges) return {}

    const result: Record<string, any[]> = {}
    roles.forEach((role) => {
      const moduleMap: Record<string, any> = {}
      role.privilegeIds.forEach((pid) => {
        const priv = privileges.find((p) => p.id === pid)
        if (priv) {
          // Get the module name from the privilege name (e.g., "user" from "user:c")
          const [module] = priv.name.split(':')
          if (!moduleMap[module]) {
            moduleMap[module] = {
              module,
              access: false,
              view: false,
              create: false,
              edit: false,
              delete: false,
              moduleName: module.charAt(0).toUpperCase() + module.slice(1), // Capitalize
            }
          }
          if (priv.name.endsWith(':c')) moduleMap[module].create = true
          if (priv.name.endsWith(':r')) moduleMap[module].view = true
          if (priv.name.endsWith(':u')) moduleMap[module].edit = true
          if (priv.name.endsWith(':d')) moduleMap[module].delete = true
        }
      })
      result[role.name] = Object.values(moduleMap)
    })
    return result
  }, [roles, privileges])

  // console.log('test: ', roles)

  return (
    <div className="relative">
      <PageTransition>
        <Container className="my-6 !px-12">
          <PageHeader
            title={title}
            subtitle="Define user roles and assign permissions to control access to various features of the system."
            actions={null}
          />
          <Spacer />

          <FlexBox direction="col" justify="center" align="start" gap="gap-4" className="w-full cursor-default">
            <Tabs
              defaultValue={defaultTab}
              value={activeTab || defaultTab}
              className="my-6 flex w-full flex-col items-start gap-8"
              onValueChange={setActiveTab}
            >
              <div className="w-full border-b border-b-neutral-200 p-0">
                <TabsList className="text-sm font-semibold">
                  {roleTabs.map((role) => (
                    <TabsTrigger
                      key={role.id}
                      value={role.name}
                      className="capitalize data-[state=active]:font-semibold"
                    >
                      {role.name.replace(/_/g, ' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <ScrollArea className="h-[calc(100vh-240px)] w-full">
                {roleTabs.map((role) => (
                  <TabsContent key={role.id} value={role.name} className="w-full">
                    <PermissionsTabContent
                      permissions={permissionsByRole[role.name] || []}
                      role={role}
                      allPrivileges={privileges}
                      isLoading={loadingRoles || loadingPrivileges}
                    />
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </FlexBox>
        </Container>
      </PageTransition>
    </div>
  )
}
