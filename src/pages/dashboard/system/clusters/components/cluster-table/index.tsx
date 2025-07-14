import { DataTable } from 'src/components/ui/data-table'
import { columns } from './columns'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { z } from 'zod'
import EmptyTableState from 'src/components/global/empty-state'
import EmptyFarmersImg from 'src/assets/images/empty-admin.jpg'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
// import { DataTable, PaginationConfig } from 'src/components/ui/enhance-data-tabe'
import { useState } from 'react'

export function ClusterTable() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.any(),
    queryKey: ['clusters'],
  })

  const useGetClusterManagers = createGetQueryHook({
    endpoint: '/users/cluster-managers',
    responseSchema: z.any(),
    queryKey: ['cluster-managers'],
  })

  const { data: clusters = [], isLoading: loadingClusters } = useGetClusters()
  const { data: clusterManagerResponse, isLoading: loadingManagers } = useGetClusterManagers()
  const clusterManagers = clusterManagerResponse?.content || []

  const clustersWithManagers: any = clusters.map((cluster: any) => ({
    ...cluster,
    users: clusterManagers.filter((manager: any) => manager.cluster?.id === cluster.id),
  }))
  const navigate = useNavigate()

  // Pagination config from API response
  // const pagination: PaginationConfig = {
  //   page: clusters.page + 1, // DataTable expects 1-based page
  //   size: clusters.size,
  //   totalElements: clusters.totalElements,
  //   totalPages: clusters.totalPages,
  //   onPageChange: (newPage: number) => setPage(newPage - 1), // Convert to 0-based for API
  //   onSizeChange: (newSize: number) => {
  //     setSize(newSize)
  //     setPage(0) // Reset to first page when size changes
  //   },
  // }

  const openCreateModal = () => {
    navigate(paths.dashboard.system.clusters.create)
  }
  return (
    <>
      {clustersWithManagers && clustersWithManagers.length > 0 ? (
        //   <DataTable
        //   columns={columns}
        //   data={clustersWithManagers}
        //   isLoading={loadingManagers}
        //   emptyStateMessage="No clusters found"
        //   // Search
        //   search={true}
        //   searchPlaceholder="Search ..."
        //   // Filters
        //   enableFilters={false}

        //   // Custom styling
        //   className="my-custom-class"
        // />
        <DataTable
          isLoading={loadingClusters}
          columns={columns}
          data={clustersWithManagers}
          emptyStateMessage="No clusters found"
        />
      ) : (
        <EmptyTableState image={EmptyFarmersImg} name="cluster" text="a cluster" buttonFunc={openCreateModal} />
      )}
    </>
  )
}
