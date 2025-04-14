import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SideBarProvider from './sidebar.provider'
import { Toaster } from 'src/components/ui/toaster'
import { HelmetProvider } from 'react-helmet-async'
import { TooltipProvider } from 'src/components/ui/tooltip'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  const queryClient = useMemo(() => new QueryClient({}), [])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SideBarProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </SideBarProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default Providers
