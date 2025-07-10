import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Spacer } from 'src/components/ui/spacer'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { Inline } from 'src/components/ui/inline'
import { Button } from 'src/components/ui/button'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { paths } from 'src/routes'
import { UsersTable } from './components/users-table'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import EmptyTableState from 'src/components/global/empty-state'
import UserPlaceholder from 'src/assets/images/user-placeholder.png'

type UserFilters = {
  cluster?: string
  role?: string
  status?: string
}

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.string()),
})

export const clusterResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.any(),
  description: z.string(),
  context: z.nullable(z.string()),
  createdDate: z.nullable(z.string()),
  lastModifiedDate: z.nullable(z.string()),
})

const useGetRoles = createGetQueryHook({
  endpoint: '/roles',
  responseSchema: z.any(),
  queryKey: ['roles'],
})

const useGetClusters = createGetQueryHook({
  endpoint: '/clusters',
  responseSchema: z.any(),
  queryKey: ['clusters'],
})

const useGetUsers = createGetQueryHook({
  endpoint: '/users',
  responseSchema: z.any(),
  queryKey: ['users'],
})

function SelectPopover<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  options: T[]
  value?: T
  onChange: (newVal: T | undefined) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col">
        <Text size="base">{placeholder}</Text>
        <PopoverTrigger asChild>
          <Button
            variant="neutral"
            size="sm"
            className="flex min-w-[220px] justify-between gap-x-2 !border border-neutral-200 bg-white text-sm capitalize"
          >
            {value || placeholder} <SolarIconSet.AltArrowDown size={14} />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="flex max-h-64 w-52 flex-col gap-1 overflow-y-scroll p-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-sm hover:bg-primary-100"
          onClick={() => {
            onChange(undefined)
            setOpen(false)
          }}
        >
          All {label}
        </Button>
        {options.map((opt) => (
          <Button
            key={opt}
            variant={opt === value ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start text-sm capitalize hover:bg-primary-100"
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
          >
            {opt}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function FilterPill({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary-300 bg-primary-100 px-3 py-0.5 text-sm">
      <Text size="xs" className="font-medium text-primary-400">
        {label}: {value}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 text-primary-500 hover:text-primary-700"
        onClick={onRemove}
      >
        <SolarIconSet.CloseCircle size={12} />
      </Button>
    </div>
  )
}

export default function UsersPage() {
  const title = 'Users'
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const { data: rolesResp, isLoading: loadingRoles } = useGetRoles()
  const { data: clustersResp, isLoading: loadingClusters } = useGetClusters()

  const STATUSES = ['Active', 'Deactivated']

  /* Derive string arrays for the pop‑overs, de‑duplicated + sorted */
  const ROLES: string[] = React.useMemo(
    () => Array.from(new Set(rolesResp?.map((r: z.infer<typeof roleSchema>) => r.name) ?? [])).sort() as string[],
    [rolesResp],
  )

  const CLUSTERS: any = React.useMemo(
    () => Array.from(new Set(clustersResp?.map((c: z.infer<typeof clusterResponseSchema>) => c.name) ?? [])).sort(),
    [clustersResp],
  )

  // Filter states
  const [tempFilters, setTempFilters] = useState<UserFilters>({
    cluster: undefined,
    role: undefined,
    status: undefined,
  })

  const [appliedFilters, setAppliedFilters] = useState<UserFilters>({
    cluster: undefined,
    role: undefined,
    status: undefined,
  })

  // Debounce search term with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Update URL params when debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm)
    } else {
      params.delete('search')
    }
    setSearchParams(params, { replace: true })
  }, [debouncedSearchTerm, setSearchParams])

  // Memoize query parameters for API call
  const queryParams = useMemo(() => {
    const params: Record<string, any> = { direction: 'DESC', page: 0, size: 1000 }

    if (appliedFilters.cluster) params.cluster = appliedFilters.cluster
    if (appliedFilters.role) params.role = appliedFilters.role
    if (appliedFilters.status) params.status = appliedFilters.status
    if (debouncedSearchTerm) params.search = debouncedSearchTerm

    return params
  }, [appliedFilters.cluster, appliedFilters.role, appliedFilters.status, debouncedSearchTerm])

  // Fetch users with the current filters - THIS IS NOW IN THE PARENT
  const {
    data: users = [],
    isLoading: loadingUsers,
    error: usersError,
  } = useGetUsers({
    query: queryParams,
  })

  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters)
  }, [showFilters])

  const handleFilterChange = useCallback((filterType: keyof UserFilters, value: string | undefined) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }, [])

  const applyFilters = useCallback(() => {
    setAppliedFilters(tempFilters)
    // Update search params for URL state management
    const params = new URLSearchParams()
    if (tempFilters.cluster) params.set('cluster', tempFilters.cluster)
    if (tempFilters.role) params.set('role', tempFilters.role)
    if (tempFilters.status) params.set('status', tempFilters.status)
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
    setSearchParams(params, { replace: true })
  }, [tempFilters, debouncedSearchTerm, setSearchParams])

  const clearFilters = useCallback(() => {
    const clearedFilters = { cluster: undefined, role: undefined, status: undefined }
    setTempFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const removeSingleFilter = useCallback(
    (filterType: keyof UserFilters) => {
      const updatedFilters = { ...appliedFilters, [filterType]: undefined }
      setAppliedFilters(updatedFilters)
      setTempFilters(updatedFilters)

      const params = new URLSearchParams(searchParams)
      params.delete(filterType)
      setSearchParams(params, { replace: true })
    },
    [appliedFilters, searchParams, setSearchParams],
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const hasActiveFilters = appliedFilters.cluster || appliedFilters.role || appliedFilters.status

  const actions = (
    <Inline>
      <Button
        variant="primary"
        className="flex items-center gap-2"
        onClick={() => navigate(paths.dashboard.users.create)}
      >
        <SolarIconSet.AddCircle size={20} />
        <Text>Add User</Text>
      </Button>
    </Inline>
  )

  // Handle error state
  if (usersError) {
    return (
      <div className="relative">
        <PageTransition>
          <Container className="!px-12">
            <PageHeader title={title} actions={actions} />
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="mb-2 text-red-500">Error loading users</p>
                <p className="text-sm text-neutral-500">Please try again later</p>
              </div>
            </div>
          </Container>
        </PageTransition>
        <Outlet />
      </div>
    )
  }

  // Handle empty state
  const showEmptyState = !loadingUsers && users.length === 0
  const hasFiltersOrSearch =
    appliedFilters.cluster || appliedFilters.role || appliedFilters.status || debouncedSearchTerm

  return (
    <div className="relative">
      <PageTransition>
        <Container className="!px-12">
          <PageHeader title={title} actions={actions} />
          <Spacer />
          {/* <FlexBox
            direction="col"
            gap="gap-2"
            className="mb-4 min-h-[5rem] w-full cursor-default rounded-md bg-neutral-50 shadow-sm"
          > */}
          {/* Search and Filter Toggle Row */}
          {/* <div className="flex w-full flex-1 items-center justify-between p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2">
                  <SolarIconSet.MinimalisticMagnifer />
                  <input
                    className="w-[360px] border-none focus:outline-none focus-visible:border-none focus-visible:ring-primary-500"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <Button variant="ghost" className="flex items-center gap-2 p-0 text-primary-500" onClick={toggleFilters}>
                <SolarIconSet.Filter size={20} />
                <Text>{showFilters ? 'hide filters' : 'show filters'}</Text>
              </Button>
            </div> */}

          {/* Filter Controls */}
          {/* {showFilters && (
              <>
                <div className="px-4 pb-4">
                  <div className=" flex items-end gap-4">
                    <SelectPopover
                      label="Cluster"
                      placeholder={loadingClusters ? 'Loading…' : 'Cluster'}
                      options={CLUSTERS}
                      value={tempFilters.cluster}
                      onChange={(v) => handleFilterChange('cluster', v)}
                    />

                    <SelectPopover
                      label="Role"
                      placeholder={loadingRoles ? 'Loading…' : 'Role'}
                      options={ROLES}
                      value={tempFilters.role}
                      onChange={(v) => handleFilterChange('role', v)}
                    />

                    <SelectPopover<string>
                      label="Status"
                      placeholder="Status"
                      options={STATUSES}
                      value={tempFilters.status}
                      onChange={(value) => handleFilterChange('status', value)}
                    />

                    <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={applyFilters}>
                      Apply
                    </Button>
                  </div>
                </div> */}
          {/* Active Filter Pills */}
          {/* {hasActiveFilters && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-4">
                      {appliedFilters.cluster && (
                        <FilterPill
                          label="Cluster"
                          value={appliedFilters.cluster}
                          onRemove={() => removeSingleFilter('cluster')}
                        />
                      )}
                      {appliedFilters.role && (
                        <FilterPill
                          label="Role"
                          value={appliedFilters.role}
                          onRemove={() => removeSingleFilter('role')}
                        />
                      )}
                      {appliedFilters.status && (
                        <FilterPill
                          label="Status"
                          value={appliedFilters.status}
                          onRemove={() => removeSingleFilter('status')}
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700"
                        onClick={clearFilters}
                      >
                        <SolarIconSet.TrashBinMinimalistic size={16} />
                        Clear filters
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </FlexBox> */}

          <ScrollArea className="h-[calc(100vh-140px)] w-full">
            <div className="h-fit">
              {showEmptyState ? (
                hasFiltersOrSearch ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <p className="mb-2 text-neutral-500">No users found matching your filters</p>
                      <p className="text-sm text-neutral-400">Try adjusting your search criteria</p>
                    </div>
                  </div>
                ) : (
                  <EmptyTableState
                    image={UserPlaceholder}
                    name="user"
                    text="a user"
                    buttonFunc={() => navigate(paths.dashboard.users.create)}
                  />
                )
              ) : (
                <UsersTable data={users?.content || []} isLoading={loadingUsers} />
              )}
            </div>
          </ScrollArea>
        </Container>
      </PageTransition>
      <Outlet />
    </div>
  )
}
