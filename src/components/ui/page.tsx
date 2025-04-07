import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import PageTransition from 'src/components/animation/page-transition'

interface PageProps {
  title?: string
  description?: string
  children: React.ReactNode
}

const formatPathToTitle = (path: string): string => {
  // Remove leading slash and split by slashes
  const segments = path.split('/').filter(Boolean)

  // Handle different layout contexts
  if (segments[0] === 'auth') {
    return segments[1] ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1) : 'Auth'
  }

  if (segments[0] === 'docs') {
    return segments[1]
      ? `Documentation - ${segments[1].charAt(0).toUpperCase() + segments[1].slice(1)}`
      : 'Documentation'
  }

  // For dashboard and other paths
  if (segments.length === 0) return 'Dashboard'

  // Remove 'dashboard' from the path if it exists
  const relevantSegments = segments[0] === 'dashboard' ? segments.slice(1) : segments

  if (relevantSegments.length === 0) return 'Dashboard'

  return relevantSegments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ')
}

export function Page({ title, description, children }: PageProps) {
  const location = useLocation()
  const pathTitle = formatPathToTitle(location.pathname)
  const pageTitle = title || pathTitle

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Catfish DB</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <PageTransition>{children}</PageTransition>
    </>
  )
}
