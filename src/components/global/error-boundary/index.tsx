import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { paths } from 'src/routes'
import * as SolarIconSet from 'solar-icon-set'

export function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const ErrorContent = ({
    title,
    description,
    icon: Icon,
    action,
  }: {
    title: string
    description: string
    icon: any
    action: {
      label: string
      onClick: () => void
    }
  }) => (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-8 text-center">
        <div className="dark:bg-error-900/20 flex h-20 w-20 items-center justify-center rounded-full bg-error-200">
          <Icon className="h-10 w-10 text-error-600 dark:text-error-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button onClick={action.onClick} variant="neutral" size="lg">
          {action.label}
        </Button>
      </div>
    </div>
  )

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <ErrorContent
            title="404 - Page Not Found"
            description="The page you're looking for doesn't exist or has been moved."
            icon={SolarIconSet.MinimalisticMagnifer}
            action={{
              label: 'Return to Dashboard',
              onClick: () => navigate(paths.dashboard.root),
            }}
          />
        )
      case 401:
        return (
          <ErrorContent
            title="401 - Unauthorized"
            description="You don't have permission to access this resource."
            icon={SolarIconSet.Lock}
            action={{
              label: 'Login',
              onClick: () => navigate(paths.auth.login),
            }}
          />
        )
      case 403:
        return (
          <ErrorContent
            title="403 - Forbidden"
            description="You don't have permission to access this resource."
            icon={SolarIconSet.Shield}
            action={{
              label: 'Return to Dashboard',
              onClick: () => navigate(paths.dashboard.root),
            }}
          />
        )
      default:
        return (
          <ErrorContent
            title={`Error ${error.status}`}
            description={error.statusText}
            icon={SolarIconSet.DangerCircle}
            action={{
              label: 'Return to Dashboard',
              onClick: () => navigate(paths.dashboard.root),
            }}
          />
        )
    }
  }

  return (
    <ErrorContent
      title="Unexpected Error"
      description="Something went wrong. Please try again later."
      icon={SolarIconSet.DangerCircle}
      action={{
        label: 'Return to Dashboard',
        onClick: () => navigate(paths.dashboard.root),
      }}
    />
  )
}
