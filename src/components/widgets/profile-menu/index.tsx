import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import * as SolarIconSet from 'solar-icon-set'
import { Link, useNavigate } from 'react-router-dom'
import { Text } from 'src/components/ui/text'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'

const ProfileMenu = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User'
  const fallbackInitial = user?.firstName?.charAt(0).toUpperCase() || 'U'

  const handleLogout = async () => {
    try {
      useAuthStore.getState().logout()
      navigate(paths.auth.login)
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
      action: handleLogout,
      icon: <SolarIconSet.Logout color="currentColor" size={20} iconStyle="Outline" />,
    },
  ]

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger>
          <div className="flex cursor-pointer items-center gap-2">
            <Avatar>
              {/* <AvatarImage src="/path-to-user-image.jpg" alt="User Avatar" /> */}
              <AvatarFallback className="text-neutral-600">{fallbackInitial}</AvatarFallback>
            </Avatar>
            <Text variant="label" color="text-neutral-600" weight="normal">
              {userName}
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="mt-2 w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-neutral-100 ring-opacity-5">
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
    </div>
  )
}

export { ProfileMenu }
