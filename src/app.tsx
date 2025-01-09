import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import SideBarProvider from './context/sidebar-context'
import { Toaster } from './components/ui/toaster'

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])
  return (
    <QueryClientProvider client={queryClient}>
      <SideBarProvider>
        <RouterProvider router={createRouter()} />
        <Toaster />
      </SideBarProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
