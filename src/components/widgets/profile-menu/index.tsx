import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from 'src/components/ui/popover'
import { Avatar, AvatarFallback } from 'src/components/ui/avatar'
import * as SolarIconSet from 'solar-icon-set'
import { Link } from 'react-router-dom'
import { Text } from 'src/components/ui/text'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { z } from 'zod'
import { userSchema } from 'src/schemas'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Dialog, DialogClose, DialogContent, DialogHeader } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { X } from 'lucide-react'
import ECLIPSE from 'src/assets/images/ellipse.png'

// Hook to handle logout API call.
const useLogout = createPostMutationHook({
  endpoint: '/auth/revoke',
  requestSchema: z.object({
    token: z.string(),
  }),
  responseSchema: z.any(),
  requiresAuth: true,
})

// Hook to fetch current user data.
export const useGetCurrentUser = createGetQueryHook({
  endpoint: '/users/me',
  responseSchema: userSchema,
  queryKey: ['user'],
  requiresAuth: true,
})

const ProfileMenu = () => {
  const { data: user } = useGetCurrentUser()
  const token = useAuthStore((state) => state.accessToken)
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User'
  const fallbackInitial = user?.firstName?.charAt(0).toUpperCase() || 'U'
  const logoutMutation = useLogout()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false)

  const handleLogout = async () => {
    if (!token) {
      console.error('No token available for logout.')
      return
    }
    try {
      await logoutMutation.mutateAsync({ token })
      localStorage.removeItem('auth-storage')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('expiresAt')
      window.location.href = paths.auth.login
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const profileLinks = [
    {
      label: 'Profile',
      href: paths.dashboard.profile,
      icon: <SolarIconSet.UserCircle color="currentColor" size={20} iconStyle="Outline" />,
    },
    {
      label: 'Logout',
      action: () => setIsLogoutDialogOpen(true),
      icon: <SolarIconSet.Logout color="currentColor" size={20} iconStyle="Outline" />,
    },
  ]

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger>
          <div className="flex cursor-pointer items-center gap-2">
            <Avatar>
              <AvatarFallback className="text-neutral-600">{fallbackInitial}</AvatarFallback>
            </Avatar>
            <Text variant="label" color="text-neutral-600" weight="normal">
              {userName}
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="relative mt-2 w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-neutral-100 ring-opacity-5">
          {profileLinks.map(({ label, href, action, icon }) => (
            <div key={label} className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
              {icon}
              {href ? (
                <Link to={href} className="text-sm font-medium text-neutral-500">
                  {label}
                </Link>
              ) : (
                <button onClick={action} className="text-sm font-medium text-neutral-500">
                  {label}
                </button>
              )}
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className=" overflow-hidden p-8">
          <picture>
            <img className="absolute left-0 top-0 w-[10rem]" src={ECLIPSE} alt="Decorative" />
          </picture>
          <DialogClose className="flex h-16 w-full items-center justify-end">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <Heading weight="semibold" level={5}>
              Confirm Logout
            </Heading>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6">
            <Text weight="light" align="left" className="w-full">
              Are you sure you want to log out?
            </Text>
            <div className="flex w-full justify-between space-x-2">
              <Button variant="outline" className="w-full" onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { ProfileMenu }
