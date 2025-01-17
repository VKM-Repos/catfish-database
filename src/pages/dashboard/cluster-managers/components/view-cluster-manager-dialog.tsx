import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from 'src/components/ui/dialog'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/layouts/text'
import { useState } from 'react'

export function ViewClusterManagerDialog() {
  const [open, isOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => isOpen(true)} className="flex w-full justify-start space-x-2" size="xs" variant="ghost">
          <SolarIconSet.Eye /> <Text>View</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px] bg-white">
        <div className="gap3 my-5 flex w-full  flex-col px-10">
          <Text variant="heading" className="text-center">
            Sophia Bennet
          </Text>
          <div className="mt-10 flex w-[80%] flex-col gap-7">
            <div className="flex w-full justify-between gap-[150px]">
              <div className="">
                <Text className="font-bold" variant="body">
                  First name
                </Text>
                <Text>Sophia</Text>
              </div>
              <div>
                <Text className="font-bold" variant="body">
                  Last name
                </Text>
                <Text>Bennet</Text>
              </div>
            </div>
            <div>
              <Text className="font-bold" variant="body">
                Email
              </Text>
              <Text>gokbell@gmail.com</Text>
            </div>
            <div>
              <Text className="font-bold" variant="body">
                CLuster
              </Text>
              <Text>Kaduna</Text>
            </div>
            <div>
              <Text className="font-bold" variant="body">
                Phone
              </Text>
              <Text>09066666644</Text>
            </div>
          </div>
        </div>
        <DialogFooter className="mb-5 justify-between space-x-2 px-5">
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" variant="primary">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
