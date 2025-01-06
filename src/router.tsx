import React from 'react'
import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom'
import { allRoutes } from './routes'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layouts'
import { isAuthenticated } from './lib/auth'
import { DashboardLayout } from './components/layouts/dashboard'
import { AuthLayout } from './components/layouts/auth'

const publicRoutes = ['/login', '/forget-password', '/reset-password']

function isPublicRoute(path: string) {
  return publicRoutes.includes(path)
}

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const auth = isAuthenticated()
  return auth ? element : <Navigate to="/login" replace />
}

export function createRouter() {
  const routeWrappers: RouteObject[] = allRoutes.map((route) => {
    const getLayout = route.Component?.getLayout || getDefaultLayout
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Component = route.Component!

    const isProtected = !isPublicRoute(route.path)

    const page = getLayout(
      isProtected ? (
        <ProtectedRoute
          element={
            <DashboardLayout>
              <Component />
            </DashboardLayout>
          }
        />
      ) : (
        <AuthLayout>
          <Component />
        </AuthLayout>
      ),
    )

    return {
      ...route,
      element: page,
      Component: null,
      ErrorBoundary: ErrorPage,
    }
  })

  return createBrowserRouter(routeWrappers)
}
