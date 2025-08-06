'use client'
import { Inline } from 'src/components/ui/inline'
import { Divider } from 'src/components/ui/divider'
import { ProfileMenu, useGetCurrentUser } from 'src/components/widgets/profile-menu'
import { NotificationMenu } from 'src/components/widgets/notification-menu'
import { HelpIcon } from 'src/components/global/help-icon'
import { Menu, X, LogOutIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
  SideDialogContent,
  DialogContent,
  DialogClose,
  DialogHeader,
} from 'src/components/ui/dialog'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { z } from 'zod'
import { useAuthStore } from 'src/store/auth.store'
import { Avatar, AvatarFallback } from 'src/components/ui/avatar'
import { removeSymbols } from 'src/lib/utils'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { Sidebar } from '../sidebar'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { paths } from 'src/routes'
import { Heading } from 'src/components/ui/heading'
import ECLIPSE from 'src/assets/images/ellipse.png'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // const location = useLocation()
  // const currentPath = location.pathname
  const { data: currentUser } = useGetCurrentUser()
  const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName?.charAt(0).toUpperCase()}.` : 'User'
  const fallbackInitial = currentUser?.firstName?.charAt(0).toUpperCase() || 'U'
  const token = useAuthStore((state) => state.accessToken)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false)
  const useLogout = createPostMutationHook({
    endpoint: '/auth/revoke',
    requestSchema: z.object({
      token: z.string(),
    }),
    responseSchema: z.any(),
    requiresAuth: true,
  })
  const logoutMutation = useLogout()
  // const navigate = useNavigate()
  const { user } = useAuthStore()

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

  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds'],
    options: {
      enabled: user?.role === 'FARMER',
    },
  })

  const useGetClusterManagerPonds = createGetQueryHook({
    endpoint: '/ponds/clusters/me',
    responseSchema: z.any(),
    queryKey: ['cluster-manager-ponds'],
    options: {
      enabled: user?.role === 'CLUSTER_MANAGER',
    },
  })

  const useGetFishBatches = createGetQueryHook({
    endpoint: `/fish-batches?farmerId=${user?.id}`,
    responseSchema: z.any(),
    queryKey: ['my-batches'],
    options: {
      enabled: true,
      staleTime: 0,
    },
  })

  const useGetFeeds = createGetQueryHook({
    endpoint: '/feed-inventories',
    responseSchema: z.any(),
    queryKey: ['my-inventory'],
    options: {
      enabled: true,
      staleTime: 0,
    },
  })

  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()
  const { data: clusterManagerPonds = [], isLoading: isLoadingClusterManagerPonds } = useGetClusterManagerPonds()
  const { data: fishBatches = [], isLoading: isLoadingFishBatches } = useGetFishBatches()
  const { data: feeds = [], isLoading: isLoadingFeeds } = useGetFeeds()

  if (user?.role === 'CLUSTER_MANAGER' && isLoadingClusterManagerPonds) {
    return <LoadingScreen />
  }
  if ((user?.role === 'FARMER' && isLoadingPonds) || isLoadingFeeds || isLoadingFishBatches) {
    return <LoadingScreen />
  }

  const hasPond = ponds.totalElements > 0 || clusterManagerPonds.totalElements > 0
  const hasBatches = fishBatches.totalElements > 0 || user?.role === 'CLUSTER_MANAGER'
  const hasFeeds = feeds.totalElements > 0 || user?.role === 'CLUSTER_MANAGER'
  const hasAllSetup = hasPond && hasBatches && hasFeeds

  return (
    <>
      <header className="sticky left-0 top-0 z-[80] flex h-[68px] w-full items-center justify-between bg-neutral-50 px-[20px] py-4 md:px-8 lg:z-[10] lg:px-3">
        <Inline className="h-full w-full" gap="gap-4">
          <picture>
            <img src="/fish-logo.webp" alt="Logo" className="aspect-square w-[38px]" />
          </picture>
          <Divider orientation="vertical" className="invisible lg:visible" />
          <div className="hidden lg:inline">
            <ProfileMenu />
          </div>
        </Inline>

        <div className="hidden w-full place-content-end items-center gap-4 lg:flex">
          <NotificationMenu />
          <HelpIcon />
        </div>

        {/* Mobile Menu */}
        <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center lg:hidden">
              {isSidebarOpen ? (
                <button className="text-primary-500">
                  <X size={24} />
                  <span className="sr-only">Close Menu</span>
                </button>
              ) : (
                <button className="text-primary-500">
                  <Menu size={24} />
                </button>
              )}
            </div>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            <SideDialogContent className=" right-0 top-[68px] z-[90] flex h-screen w-[calc(100vw-50px)] flex-col justify-start gap-10 overflow-y-auto bg-white p-4 shadow-lg focus:outline-none lg:hidden">
              {(user?.role == 'FARMER' && hasAllSetup) ||
              user?.role == 'CLUSTER_MANAGER' ||
              user?.role == 'SUPER_ADMIN' ? (
                <>
                  <div className="mt-5">
                    <ProfileMenu onLinkClick={() => setIsSidebarOpen(false)} />
                  </div>
                  <div className="rounded-lg">
                    <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between gap-10">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="text-neutral-600">{fallbackInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Text variant="label" color="text-neutral-600" weight="semibold" size="lg" className="capitalize">
                        {userName}
                      </Text>
                      <Text variant="label" color="text-neutral-500" weight="light" size="sm" className="lowercase">
                        {removeSymbols(user?.role ?? 'FARMER')}
                      </Text>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="flex justify-start gap-4 border border-solid border-neutral-200 px-[25px] py-5 text-red-600"
                    onClick={() => {
                      setIsSidebarOpen(false)
                      setIsLogoutDialogOpen(true)
                    }}
                  >
                    <LogOutIcon /> log out
                  </Button>
                </div>
              )}
            </SideDialogContent>
          </DialogPortal>
        </Dialog>
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogOverlay
            className="fixed inset-0 !z-[950] bg-black/70 backdrop-blur-lg lg:bg-black/50 lg:backdrop-blur-sm"
            onClick={() => setIsLogoutDialogOpen(false)}
          />
          <DialogContent className="z-[100] w-[90%] overflow-hidden rounded-lg p-8 lg:w-[full]">
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
      </header>
    </>
  )
}
