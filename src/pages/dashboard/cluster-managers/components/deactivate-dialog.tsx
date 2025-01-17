import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from 'src/components/ui/dialog'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/layouts/text'
import { useState } from 'react'

export function DeactivateDialog() {
  const [open, isOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => isOpen(true)} className="space-x-2" size="xs" variant="ghost">
          <SolarIconSet.ForbiddenCircle /> <Text>Deactivate User</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit bg-white">
        <div className="gap3 flex w-full flex-col px-7 py-4">
          <div className=" flex justify-end">
            <DialogClose asChild>
              <Button variant="ghost">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.7123 16.773L7.22699 8.28768C6.93708 7.99776 6.93708 7.51693 7.22699 7.22702C7.51691 6.9371 7.99774 6.9371 8.28765 7.22702L16.7729 15.7123C17.0628 16.0022 17.0628 16.483 16.7729 16.773C16.483 17.0629 16.0022 17.0629 15.7123 16.773Z"
                    fill="#1C274C"
                  />
                  <path
                    d="M7.22706 16.773C6.93715 16.4831 6.93715 16.0023 7.22706 15.7124L15.7123 7.22711C16.0023 6.93719 16.4831 6.93719 16.773 7.22711C17.0629 7.51702 17.0629 7.99785 16.773 8.28777L8.28772 16.773C7.99781 17.063 7.51698 17.063 7.22706 16.773Z"
                    fill="#1C274C"
                  />
                </svg>
              </Button>
            </DialogClose>
          </div>

          <Text variant="heading">Deactivate user?</Text>
          <Text variant="body">You are about to deactivate a user, this action can be undone.</Text>
        </div>
        <DialogFooter className="mb-5 justify-between space-x-2 px-5">
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" variant="primary">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
