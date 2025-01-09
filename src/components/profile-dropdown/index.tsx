import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Avatar, AvatarFallback } from '../ui/avatar'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from '../layouts/text'
import { Link } from 'react-router-dom'

const ProfileDropdown = () => {
  const userName = 'Adegoke Bello'
  const lastName = userName.split(' ')[1] || ''
  const fallbackInitial = lastName.charAt(0).toUpperCase()

  const profileLinks = [
    {
      label: 'Account',
      href: '/account',
      icon: <SolarIconSet.SettingsMinimalistic color="currentColor" size={20} iconStyle="Outline" />,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <SolarIconSet.UserCircle color="currentColor" size={20} iconStyle="Outline" />,
    },
    {
      label: 'Logout',
      action: () => console.log('Logout clicked'),
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
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            <Text variant="label">{userName}</Text>
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

export { ProfileDropdown }
