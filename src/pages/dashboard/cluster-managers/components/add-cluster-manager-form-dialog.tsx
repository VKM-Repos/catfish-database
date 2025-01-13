import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

import * as SolarIconSet from 'solar-icon-set'
import { Divider } from 'src/components/layouts/divider'
import { Input } from 'src/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'

export function AddClusterManagerFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center gap-2 border border-primary-500 bg-primary-500 py-4 text-white hover:bg-[#F0E8F4] hover:text-black">
          <SolarIconSet.AddCircle /> Add cluster manager
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader className="p-3 text-center">
          <DialogTitle className="text-center">Add a cluster manager</DialogTitle>
          <Divider />
        </DialogHeader>
        <div className="flex w-full flex-col items-center gap-7 p-7 ">
          <div className="flex w-full items-center justify-center gap-2">
            <Input type="text" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="First name" />
            <Input type="text" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Last name" />
          </div>
          <div className="w-full">
            <Input type="email" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Email" />
          </div>
          <div className="w-full">
            <Select>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <SolarIconSet.Signpost />
                  <SelectValue placeholder="Cluster" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="Yobe">Yobe</SelectItem>
                  <SelectItem value="Osun">Osun</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input type="tel" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Phone" />
          </div>
        </div>
        <DialogFooter className="mt-1 flex w-full justify-between bg-neutral-100 px-7 py-4">
          <DialogClose asChild>
            <Button className="border border-primary-500 font-light hover:bg-[#F0E8F4]" variant="outline" type="button">
              Back
            </Button>
          </DialogClose>
          <Button className="bg-primary-500 font-light text-white hover:bg-[#F0E8F4] hover:text-black" type="submit">
            Add cluster manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
