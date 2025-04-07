import React, { Suspense } from 'react'
import { LoadingScreen } from 'src/components/global/loading-screen'

type LazyPageProps = () => Promise<{ default: React.ComponentType<any> }>

export function LazyPage(importFunc: LazyPageProps) {
  const LazyComponent = React.lazy(importFunc)
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LazyComponent />
    </Suspense>
  )
}

export function lazyLoad(importFunc: () => Promise<{ default: React.ComponentType<any> }>) {
  return React.lazy(importFunc)
}
