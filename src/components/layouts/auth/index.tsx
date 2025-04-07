import { Outlet, useNavigate } from 'react-router-dom'
import { Page } from 'src/components/ui/page'

export function AuthLayout() {
  const navigate = useNavigate()

  return (
    <Page>
      <div className="flex min-h-screen items-center justify-center bg-primary-500 bg-waves bg-cover bg-center p-4">
        <Outlet />
      </div>
    </Page>
  )
}
