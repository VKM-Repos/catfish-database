import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { ScrollArea } from 'src/components/ui/scroll-area'
import { Badge } from 'src/components/ui/badge'

// Mock notifications data - replace with real data later
const notifications = [
  {
    id: 1,
    title: 'New farmer registered',
    message: 'John Doe has been registered as a new farmer',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    title: 'Cluster manager assigned',
    message: 'Sarah Smith has been assigned to Cluster A',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    title: 'System update',
    message: 'The system has been updated to version 2.0',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    title: 'Cluster manager assigned',
    message: 'Tam Z has been assigned to Cluster A',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 5,
    title: 'Cluster manager assigned',
    message: 'Smith Willow has been assigned to Cluster A',
    time: '1 hour ago',
    read: true,
  },
]

export function NotificationMenu() {
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary-600 hover:text-primary-400">
          <SolarIconSet.Bell color="currentColor" size={20} iconStyle="Outline" />
          {unreadCount > 0 && (
            <Badge
              text={unreadCount.toString()}
              color="text-white"
              background="bg-destructive"
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px]"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <Text variant="subtitle">Notifications</Text>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px] shadow-inner">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-1 border-b border-neutral-200 p-4 ${
                    !notification.read ? 'bg-primary-100' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Text variant="body" size="sm" weight="normal" color="text-neutral-900">
                      {notification.title}
                    </Text>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                  </div>
                  <Text variant="body" size="xs" weight="light" color="text-neutral-500">
                    {notification.message}
                  </Text>
                  <Text variant="caption" size="xs" color="text-neutral-400">
                    {notification.time}
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <Text variant="body" className="text-neutral-500">
                No notifications
              </Text>
            </div>
          )}
        </ScrollArea>
        <div className=" p-2">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
